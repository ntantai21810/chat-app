import { AuthModel } from "../../domains";

export interface IAuthPresenter {
  setAuth(authModel: AuthModel): void;
  setError(error: string): void;
  setIsLoggingIn(isLoggingIn: boolean): void;
  setIsLoadingAuth(isLoading: boolean): void;
  setIsLoggingOut(isLoggingOut: boolean): void;
  logout(): void;
}
