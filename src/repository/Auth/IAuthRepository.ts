import { AuthModel } from "../../domains/Auth";

export interface IAuthRepository {
  login(phone: string, password: string): Promise<AuthModel>;
  register(
    phone: string,
    fullName: string,
    password: string
  ): Promise<AuthModel>;
  getAuth(): AuthModel | null;
  clearAuth(): void;
}
