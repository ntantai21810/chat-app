import { IUser } from "./User";
export interface IAuth extends Omit<IUser, "createdAt" | "updatedAt"> {
  accessToken: string;
}
