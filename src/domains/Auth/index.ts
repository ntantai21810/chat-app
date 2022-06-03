import { UserModel } from "./../User/index";

export class AuthModel {
  private user: UserModel;
  private accessToken: string = "";

  constructor(user: UserModel, accessToken: string) {
    this.user = user;
    this.accessToken = accessToken;
  }

  getUser() {
    return this.user;
  }

  getAccessToken() {
    return this.accessToken;
  }

  setUser(user: UserModel) {
    this.user = user;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }
}
