import CryptoJS from "crypto-js";
import jwtDecode from "jwt-decode";
import { IAuth } from "../../domains";
import { IAuthStorageDataSource } from "../../repository";
import { IStorage } from "../../storage";

export class AuthStorageDataSource implements IAuthStorageDataSource {
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  loadAuth(): IAuth | null {
    const ciphertext = this.storage.get("auth");

    if (!ciphertext) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, "secret key 123");
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      const auth: IAuth = JSON.parse(originalText);

      if (jwtDecode<any>(auth.accessToken).exp < Date.now() / 1000) {
        this.storage.remove("auth");
        return null;
      }

      return auth;
    } catch (e) {
      this.storage.remove("auth");
      return null;
    }
  }

  logout(): void {
    this.storage.remove("auth");
  }

  setAuth(auth: IAuth): void {
    try {
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(auth),
        "secret key 123"
      ).toString();

      this.storage.set("auth", ciphertext);
    } catch (e) {
      console.log(e);
    }
  }
}
