import * as React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import Divider from "../../components/common/Divider";
import RegisterForm, { IRegisterFormData } from "../../components/RegisterForm";
import styles from "./style.module.scss";

export interface IRegisterPageProps {}

export default function RegisterPage(props: IRegisterPageProps) {
  const handleRegister = (data: IRegisterFormData) => console.log(data);

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={Logo} alt="Chat app logo" />
      </div>
      <h1 className={styles.title}>Đăng ký tài khoản</h1>

      <RegisterForm onSubmit={handleRegister} />

      <Divider margin="4.2rem 0" width="2px" />

      <p className={styles.signIn}>
        Đã có tài khoản? <Link to="/">Đăng nhập ngay</Link>
      </p>
    </div>
  );
}
