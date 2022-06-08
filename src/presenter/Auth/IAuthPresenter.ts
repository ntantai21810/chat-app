import { AuthModel } from "../../domains/Auth";

export interface IAuthPresenter {
  setAuth(auth: AuthModel): void;
  setError(error: string): void;
  setIsLogging(isLogging: boolean): void;
}
