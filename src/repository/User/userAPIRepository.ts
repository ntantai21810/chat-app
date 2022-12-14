import { IUser, modelUserData, UserModel } from "../../domains";
import {
  IGetOneUserByPhoneRepo,
  IGetUserByIdRepo,
  IGetUserByPhoneRepo,
} from "../../useCases";

export interface IUserAPIDataSource {
  getUserById(id: string): Promise<IUser | null>;
  getUserByPhone(phone: string): Promise<IUser[]>;
  getOneUserByPhone(phone: string): Promise<IUser | null>;
}

export class UserAPIRepository
  implements IGetUserByIdRepo, IGetUserByPhoneRepo, IGetOneUserByPhoneRepo
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

  async getOneUserByPhone(phone: string): Promise<UserModel | null> {
    const res = await this.dataSource.getOneUserByPhone(phone);

    if (res) {
      const userModel = modelUserData(res);
      return userModel;
    }

    return null;
  }
}
