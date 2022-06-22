import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDispatch } from "../../../adapter/frameworkAdapter";
import { useAuth } from "../../../adapter/redux";
import { authController } from "../../../bootstrap";
import { setAuthError } from "../../../framework/redux/auth";
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
  //Adapter
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = getDispatch();

  const handleLogin = (data: ILoginFormData) => {
    authController.login(data.phone, data.password);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setAuthError(""));
  }, []);

  React.useEffect(() => {
    if (auth.auth.accessToken) {
      navigate("/chat");
    }
  }, [auth.auth.accessToken, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img className={styles.logo} src={Logo} alt="Chat app logo" />
        </div>
        <h1 className={styles.title}>Đăng nhập tài khoản</h1>

        <LoginForm
          isLogging={auth.isLoggingIn}
          onSubmit={handleLogin}
          errorMessage={auth.error}
        />

        <Divider margin="4.2rem 0" width="2px" />

        <p className={styles.signUp}>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
