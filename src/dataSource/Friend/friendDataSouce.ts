import { IUser } from "../../domains";
import { IFriendStorageDataSource } from "../../repository";
import { IDatabase } from "../../storage";

export class FriendDataSource implements IFriendStorageDataSource {
  private database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  getAllFriend(): Promise<IUser[]> {
    return this.database.get("friend", "friend");
  }

  addFriend(friend: IUser): void {
    this.database.add("friend", "friend", friend);
  }
}
