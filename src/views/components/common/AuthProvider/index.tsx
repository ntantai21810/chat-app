import jwtDecode from "jwt-decode";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { setAuth } from "../../../../redux/auth";

export interface IAuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: IAuthProviderProps) {
  const navigate = useNavigate();

  //Redux
  const currentAccessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();

  //Token
  const auth = localStorage.getItem("auth");
  const token = auth && JSON.parse(auth).accessToken;
  const isValidToken =
    !!token && !(jwtDecode<any>(token).exp < Date.now() / 1000);

  React.useEffect(() => {
    if (!isValidToken) {
      localStorage.removeItem("auth");

      navigate("/login");
    } else {
      //Dispatch to redux if not have
      if (!currentAccessToken) dispatch(setAuth(JSON.parse(auth)));
    }
  }, [navigate, isValidToken, auth, currentAccessToken, dispatch]);

  if (isValidToken) {
    return <div>{children}</div>;
  }

  return <div></div>;
}
