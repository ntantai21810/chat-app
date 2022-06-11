import { IAuth } from "../../domains/Auth";

export interface IAuthDataSouce {
  login(phone: string, password: string): Promise<IAuth>;
  register(phone: string, fullName: string, password: string): Promise<IAuth>;
  loadAuth(): Promise<IAuth | null>;
  logout(): Promise<boolean>;
}
