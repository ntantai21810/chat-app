import { IUser, UserModel } from "../../domains/User";
import { modelUserData } from "../../domains/User/helper";
import { IGetUserByIdRepo } from "../../useCases/User";
import { IGetUserByPhoneRepo } from "../../useCases/User/getUserByPhoneUseCase";

export interface IUserAPIDataSource {
  getUserById(id: string): Promise<IUser | null>;
  getUserByPhone(phone: string): Promise<IUser[]>;
}

export default class UserAPIRepository
  implements IGetUserByIdRepo, IGetUserByPhoneRepo
{
  private dataSource: IUserAPIDataSource;

  constructor(dataSource: IUserAPIDataSource) {
    this.dataSource = dataSource;
  }

  async getUserById(id: string): Promise<UserModel | null> {
    const res = await this.dataSource.getUserById(id);

    if (res) {
      const userModel = modelUserData(res);
      return userModel;
    }

    return null;
  }

  async getUsersByPhone(phone: string): Promise<UserModel[]> {
    const res = await this.dataSource.getUserByPhone(phone);

    const userModels: UserModel[] = [];

    for (let user of res) {
      const userModel = modelUserData(user);
      userModels.push(userModel);
    }

    return userModels;
  }
}
