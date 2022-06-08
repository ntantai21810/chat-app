import { IUser } from "../User";

export interface IAuth {
  user: IUser;
  accessToken: string;
}
