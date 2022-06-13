import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../adapter/redux";

export interface IAuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: IAuthProviderProps) {
  const navigate = useNavigate();

  const accessToken = useAuth().auth.accessToken;

  React.useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate, accessToken]);

  if (accessToken) {
    return <div>{children}</div>;
  }

  return <div></div>;
}
