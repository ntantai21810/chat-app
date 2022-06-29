import { UserModel } from "../../domains";

export interface IFriendPresenter {
  addFriends(userModels: UserModel | UserModel[]): void;
}
