import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import Divider from "../../components/common/Divider";
import LoginForm from "../../components/LoginForm";
import styles from "./style.module.scss";

export interface ILoginPageProps {}

export interface ILoginFormData {
  phone: string;
  password: string;
}

export default function LoginPage(props: ILoginPageProps) {
  const navigate = useNavigate();

  const handleLogin = (data: ILoginFormData) => {
    console.log(data);

    navigate("/chat");
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

      <LoginForm onSubmit={handleLogin} />

      <Divider margin="4.2rem 0" width="2px" />

      <p className={styles.signUp}>
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </div>
  );
}
