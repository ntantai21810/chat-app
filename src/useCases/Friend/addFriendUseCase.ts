import { IFriendPresenter } from "./../../presenter/Friend/IFriendPresenter";
import { UserModel } from "../../domains/User";

export interface IAddFriendRepo {
  addFriend(friendModel: UserModel): void;
}

export default class AddFriendUseCase {
  private repository: IAddFriendRepo;
  private presetner: IFriendPresenter;

  constructor(repository: IAddFriendRepo, presenter: IFriendPresenter) {
    this.repository = repository;
    this.presetner = presenter;
  }

  async execute(friendModel: UserModel) {
    try {
      this.repository.addFriend(friendModel);
      this.presetner.addFriends(friendModel);
    } catch (e) {
      console.log(e);
    }
  }
}
