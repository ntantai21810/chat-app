import {
  IUser,
  modelUserData,
  normalizeUserData,
  UserModel,
} from "../../domains";
import { IAddFriendRepo, IGetAllFriendRepo } from "../../useCases";

export interface IFriendStorageDataSource {
  getAllFriend(): Promise<IUser[]>;
  addFriend(friend: IUser): void;
}

export class FriendStorageRepository
  implements IGetAllFriendRepo, IAddFriendRepo
{
  private dataSource: IFriendStorageDataSource;

  constructor(dataSource: IFriendStorageDataSource) {
    this.dataSource = dataSource;
  }

  async getAllFriend(): Promise<UserModel[]> {
    const res = await this.dataSource.getAllFriend();

    const friendModels: UserModel[] = [];

    for (let friend of res) {
      const friendModel = modelUserData(friend);
      friendModels.push(friendModel);
    }

    return friendModels;
  }

  addFriend(friendModel: UserModel): void {
    const friend = normalizeUserData(friendModel);

    this.dataSource.addFriend(friend);
  }
}
