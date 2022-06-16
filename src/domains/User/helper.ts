import { IUser } from "./IUser";
import UserModel from "./userModel";

export function modelUserData(user: IUser): UserModel {
  const { _id, fullName, phone, avatar, lastOnlineTime } = user;

  return new UserModel(_id, fullName, phone, lastOnlineTime, avatar);
}

export function normalizeUserData(userModel: UserModel): IUser {
  return {
    _id: userModel.getId(),
    fullName: userModel.getFullName(),
    phone: userModel.getPhone(),
    avatar: userModel.getAvatar(),
    lastOnlineTime: userModel.getLastOnlineTime(),
  };
}
