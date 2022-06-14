import { IAuth } from "../domains/Auth";
import { IAuthLocalStorage } from "./IStorage";
import CryptoJS from "crypto-js";
import jwtDecode from "jwt-decode";

export default class LocalStorage implements IAuthLocalStorage {
  private static instance: LocalStorage;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new LocalStorage();
    }

    return this.instance;
  }

  getAuth(): IAuth | null {
    const ciphertext = localStorage.getItem("auth");

    if (!ciphertext) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, "secret key 123");
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      const auth: IAuth = JSON.parse(originalText);

      if (jwtDecode<any>(auth.accessToken).exp < Date.now() / 1000) {
        localStorage.removeItem("auth");
        return null;
      }

      return auth;
    } catch (e) {
      localStorage.removeItem("auth");
      return null;
    }
  }

  setAuth(auth: IAuth): void {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(auth),
      "secret key 123"
    ).toString();

    localStorage.setItem("auth", ciphertext);
  }

  clearAuth(): void {
    localStorage.removeItem("auth");
  }
}
