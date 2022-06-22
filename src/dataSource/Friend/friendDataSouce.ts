import { IUser } from "../../domains/User";
import { IFriendStorageDataSource } from "../../repository/Friend/friendStorageRepository";

export interface IFriendDatabase {
  getAllFriend(): Promise<IUser[]>;
  addFriend(friend: IUser): void;
}

export default class FriendDataSource implements IFriendStorageDataSource {
  private database: IFriendDatabase;

  constructor(database: IFriendDatabase) {
    this.database = database;
  }

  getAllFriend(): Promise<IUser[]> {
    return this.database.getAllFriend();
  }

  addFriend(friend: IUser): void {
    this.database.addFriend(friend);
  }
}
