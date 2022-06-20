import { getDispatch } from "../../adapter/frameworkAdapter";
import { IUser, UserModel } from "../../domains/User";
import { normalizeUserData } from "../../domains/User/helper";
import { addManyFriend, addOneFriend } from "../../framework/redux/friend";

import { IFriendPresenter } from "./IFriendPresenter";

export default class FriendPresenter implements IFriendPresenter {
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
