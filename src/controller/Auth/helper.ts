import { AuthModel, IAuth } from "../../domains/Auth";
import { IUser, UserModel } from "../../domains/User";

export function modelAuthData(auth: IAuth): AuthModel {
  const user = auth.user;
  const accessToken = auth.accessToken;

  const userModel = new UserModel(
    user._id,
    user.fullName,
    user.phone,
    user.avatar
  );

  return new AuthModel(userModel, accessToken);
}

export function normalizeAuthData(authModel: AuthModel): IAuth {
  const userModel = authModel.getUser();

  const user: IUser = {
    _id: userModel.getId(),
    fullName: userModel.getFullName(),
    phone: userModel.getPhone(),
    avatar: userModel.getAvatar(),
  };

  return {
    user,
    accessToken: authModel.getAccessToken(),
  };
}
