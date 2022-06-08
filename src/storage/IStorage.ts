import { IAuth } from "../domains/Auth";

export interface IStorage {
  getAuth(): IAuth | null;
  setAuth(auth: IAuth): void;
  clearAuth(): void;
}
