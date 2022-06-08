import * as React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../adapter/authAdapter";
import { useNav } from "../../../adapter/frameworkAdapter";
import { authController } from "../../../bootstrap";
import Logo from "../../assets/images/Logo.png";
import Divider from "../../components/common/Divider";
import RegisterForm, { IRegisterFormData } from "../../components/RegisterForm";
import styles from "./style.module.scss";

export interface IRegisterPageProps {}

export default function RegisterPage(props: IRegisterPageProps) {
  //Adapter
  const auth = useAuth();
  const navigate = useNav();

  const handleRegister = (data: IRegisterFormData) => {
    authController.register(data.phone, data.fullName, data.password);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    if (auth.auth.accessToken) {
      navigate("/chat");
    }
  }, [auth.auth.accessToken, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={Logo} alt="Chat app logo" />
      </div>
      <h1 className={styles.title}>Đăng ký tài khoản</h1>

      <RegisterForm onSubmit={handleRegister} errorMessage={auth.error} />

      <Divider margin="4.2rem 0" width="2px" />

      <p className={styles.signIn}>
        Đã có tài khoản? <Link to="/">Đăng nhập ngay</Link>
      </p>
    </div>
  );
}
