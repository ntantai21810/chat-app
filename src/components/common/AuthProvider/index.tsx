import jwtDecode from "jwt-decode";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { SocketContext } from "../../../App";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setAuth } from "../../../redux/auth";

export interface IAuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: IAuthProviderProps) {
  const navigate = useNavigate();

  //Redux
  const currentAccessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();

  //Socket
  const { socket: currentSocket, setSocket } = React.useContext(SocketContext);

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
      //Connect socket
      if (!currentSocket && setSocket) {
        const socket = io(
          process.env.REACT_APP_SOCKET_URL || "http://localhost:8000"
        );

        socket.emit("join", JSON.parse(auth)._id);

        socket.on("online users", (users) => {
          console.log(users);
        });

        setSocket(socket);
      }

      //Dispatch to redux if not have
      if (!currentAccessToken) dispatch(setAuth(JSON.parse(auth)));
    }
  }, [navigate]);

  if (isValidToken) {
    return <div>{children}</div>;
  }

  return <div></div>;
}
