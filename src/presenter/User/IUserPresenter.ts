import { UserModel } from "../../domains/User";

export interface IUserPresenter {
  addUserOnline(userModels: UserModel | UserModel[]): void;
  removeUserOnline(userModel: UserModel): void;
}
