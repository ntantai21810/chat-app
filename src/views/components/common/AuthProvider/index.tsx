import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../adapter/redux";
import LoadingIcon from "../LoadingIcon";
import Modal from "../Modal";
import styles from "./styles.module.scss";

export interface IAuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: IAuthProviderProps) {
  const navigate = useNavigate();

  const auth = useAuth();

  const accessToken = auth.auth.accessToken;

  React.useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate, accessToken]);

  if (auth.isLoadingAuth) {
    return (
      <Modal show={true} width="14rem" height="10rem">
        <div className={styles.loading}>
          <LoadingIcon />
          <span className={styles.text}>Đang đăng nhập</span>
        </div>
      </Modal>
    );
  }

  if (accessToken) {
    return <div>{children}</div>;
  }

  return <div></div>;
}
