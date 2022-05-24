import { IRegisterFormData } from "./../components/RegisterForm/index";
import clientRequest from "../configs/axios";
import { ILoginFormData } from "./../pages/Login/index";

export const login = (data: ILoginFormData) => {
  return clientRequest.post("/api/login", data);
};

export const register = (data: IRegisterFormData) => {
  return clientRequest.post("/api/register", data);
};
