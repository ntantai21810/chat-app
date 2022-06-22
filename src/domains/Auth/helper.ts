import { AuthModel, IAuth } from ".";
import { IUser } from "../User";
import { modelUserData, normalizeUserData } from "../User/helper";

export function modelAuthData(auth: IAuth): AuthModel {
  const user = auth.user;
  const accessToken = auth.accessToken;

  const userModel = modelUserData(user);

  return new AuthModel(userModel, accessToken);
}

export function normalizeAuthData(authModel: AuthModel): IAuth {
  const userModel = authModel.getUser();

  const user: IUser = normalizeUserData(userModel);

  return {
    user,
    accessToken: authModel.getAccessToken(),
  };
}
