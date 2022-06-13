import { getDispatch } from "../../adapter/frameworkAdapter";
import { IUser, UserModel } from "../../domains/User";
import { normalizeUserData } from "../../domains/User/helper";
import {
  addManyOnlineUser,
  addOneOnlineUser,
  removeOneOnlineUser,
} from "../../framework/redux/onlineUser";
import { IUserPresenter } from "./IUserPresenter";

export default class UserPresenter implements IUserPresenter {
  private dispatch;

  constructor() {
    this.dispatch = getDispatch();
  }

  addUserOnline(userModels: UserModel | UserModel[]): void {
    if (Array.isArray(userModels)) {
      const users: IUser[] = [];

      for (let userModel of userModels) {
        const user = normalizeUserData(userModel);
        users.push(user);
      }

      this.dispatch(addManyOnlineUser(users));
    } else {
      const user = normalizeUserData(userModels);

      this.dispatch(addOneOnlineUser(user));
    }
  }

  removeUserOnline(userModel: UserModel): void {
    const user = normalizeUserData(userModel);

    this.dispatch(removeOneOnlineUser(user._id));
  }
}
