import { getDispatch } from "../../adapter/frameworkAdapter";
import { IUser, normalizeUserData, UserModel } from "../../domains";
import { addManyFriend, addOneFriend } from "../../framework/redux";
import { IFriendPresenter } from "./IFriendPresenter";

export class FriendPresenter implements IFriendPresenter {
  private dispatch;

  constructor() {
    this.dispatch = getDispatch();
  }

  addFriends(userModels: UserModel | UserModel[]): void {
    if (Array.isArray(userModels)) {
      const users: IUser[] = [];

      for (let userModel of userModels) {
        const user = normalizeUserData(userModel);
        users.push(user);
      }

      this.dispatch(addManyFriend(users));
    } else {
      const user = normalizeUserData(userModels);

      this.dispatch(addOneFriend(user));
    }
  }
}
