import { IAuth } from "../domains/Auth";
import { IStorage } from "./IStorage";

export default class LocalStorage implements IStorage {
  constructor() {}

  getAuth(): IAuth | null {
    const auth = localStorage.getItem("auth");

    if (auth) {
      return JSON.parse(auth);
    }

    return null;
  }

  setAuth(auth: IAuth): void {
    localStorage.setItem("auth", JSON.stringify(auth));
  }

  clearAuth(): void {
    localStorage.removeItem("auth");
  }
}
