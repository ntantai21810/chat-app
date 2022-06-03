import { IUser } from "./../models/User";
import clientRequest from "../configs/axios";

export const getUser = (id: string) => {
  return clientRequest.get<IUser>(`/api/users/${id}`);
};
