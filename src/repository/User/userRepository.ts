import { IUserDataSouce } from "../../dataSource/User";
import { IUser, UserModel } from "../../domains/User";
import { modelUserData } from "../../domains/User/helper";
import { SOCKET_CONSTANTS } from "../../helper/constants";
import { IListenUserOnlineRepo } from "../../useCases/User";
import { IGetUserRepo } from "../../useCases/User/getUserUseCase";
import { IListenUserOfflineRepo } from "../../useCases/User/listenUserOfflineUseCase";

export default class UserRepository
  implements IListenUserOnlineRepo, IGetUserRepo, IListenUserOfflineRepo
{
  private dataSource: IUserDataSouce;

  constructor(dataSource: IUserDataSouce) {
    this.dataSource = dataSource;
  }

  listenUserOnline(
    channel: string,
    callback: (users: UserModel | UserModel[]) => void
  ): void {
    this.dataSource.listenUserOnline(channel, (users: IUser | IUser[]) => {
      if (Array.isArray(users)) {
        const userModels: UserModel[] = [];

        for (let user of users) {
          const userModel = modelUserData(user);
          userModels.push(userModel);
        }

        callback(userModels);
      } else {
        const userModel = modelUserData(users);

        callback(userModel);
      }
    });
  }

  signal(): void {
    this.dataSource.send(SOCKET_CONSTANTS.GET_USER_ONLINE);
  }

  async getUser(id: string): Promise<UserModel | null> {
    const res = await this.dataSource.getUser(id);

    let userModel: UserModel | null = null;

    if (res) userModel = modelUserData(res);

    return userModel;
  }

  listenUserOffline(
    channel: string,
    callback: (user: UserModel) => void
  ): void {
    this.dataSource.listenUserOffline(channel, (user) => {
      const userModel = modelUserData(user);

      callback(userModel);
    });
  }
}
