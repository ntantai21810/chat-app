import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDispatch } from "../../../adapter/frameworkAdapter";
import { useAuth } from "../../../adapter/redux";
import { authController } from "../../../bootstrap";
import { setAuthError } from "../../../framework/redux/auth";
import Logo from "../../assets/images/Logo.png";
import Divider from "../../components/common/Divider";
import RegisterForm, { IRegisterFormData } from "../../components/RegisterForm";
import styles from "../../assets/styles/RegisterPage.module.scss";

export interface IRegisterPageProps {}

export default function RegisterPage(props: IRegisterPageProps) {
  //Adapter
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = getDispatch();

  const handleRegister = (data: IRegisterFormData) => {
    authController.register(
      data.phone,
      data.fullName,
      data.password,
      data.avatar
    );
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
        <h1 className={styles.title}>Đăng ký tài khoản</h1>

        <RegisterForm
          isLogging={auth.isLoggingIn}
          onSubmit={handleRegister}
          errorMessage={auth.error}
        />

        <Divider margin="2rem 0" width="2px" />

        <p className={styles.signIn}>
          Đã có tài khoản? <Link to="/">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}
