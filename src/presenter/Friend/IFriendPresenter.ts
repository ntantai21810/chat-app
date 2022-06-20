import { UserModel } from "../../domains/User";

export interface IFriendPresenter {
  addFriends(userModels: UserModel | UserModel[]): void;
}
