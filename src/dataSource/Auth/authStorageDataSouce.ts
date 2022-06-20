import { IAuth } from "../../domains/Auth";
import { IAuthStorageDataSource } from "../../repository/Auth/authStorageRepository";

export interface IAuthStorage {
  getAuth(): IAuth | null;
  setAuth(auth: IAuth): void;
  clearAuth(): void;
}

export default class AuthStorageDataSource implements IAuthStorageDataSource {
  private storage: IAuthStorage;

  constructor(storage: IAuthStorage) {
    this.storage = storage;
  }

  loadAuth(): IAuth | null {
    return this.storage.getAuth();
  }

  logout(): void {
    this.storage.clearAuth();
  }

  setAuth(auth: IAuth): void {
    this.storage.setAuth(auth);
  }
}
