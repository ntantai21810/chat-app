import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { login } from "../../apis/auth";
import { SocketContext } from "../../App";
import Logo from "../../assets/images/Logo.png";
import Divider from "../../components/common/Divider";
import LoginForm from "../../components/LoginForm";
import { CONSTANTS } from "../../constants";
import { useAppDispatch } from "../../hooks/redux";
import { setAuth } from "../../redux/auth";
import styles from "./style.module.scss";

export interface ILoginPageProps {}

export interface ILoginFormData {
  phone: string;
  password: string;
}

export default function LoginPage(props: ILoginPageProps) {
  const navigate = useNavigate();

  const disptach = useAppDispatch();

  const { setSocket } = React.useContext(SocketContext);

  const [errorMessage, setErrorMessage] = React.useState("");

  const handleLogin = async (data: ILoginFormData) => {
    try {
      const res = await login(data);

      disptach(
        setAuth({
          ...res.data.user,
          accessToken: res.data.accessToken,
        })
      );
      if (setSocket) setSocket(io("http://localhost:8000"));

      navigate("/chat");
    } catch (e: any) {
      setErrorMessage(
        e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR
      );
      setTimeout(() => setErrorMessage(""), 2500);
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={Logo} alt="Chat app logo" />
      </div>
      <h1 className={styles.title}>Đăng nhập tài khoản</h1>

      <LoginForm onSubmit={handleLogin} errorMessage={errorMessage} />

      <Divider margin="4.2rem 0" width="2px" />

      <p className={styles.signUp}>
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </div>
  );
}
