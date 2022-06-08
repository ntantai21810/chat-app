import * as React from "react";
import { useAuth } from "../../../../adapter/authAdapter";
import { useNav } from "../../../../adapter/frameworkAdapter";

export interface IAuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: IAuthProviderProps) {
  const navigate = useNav();

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
