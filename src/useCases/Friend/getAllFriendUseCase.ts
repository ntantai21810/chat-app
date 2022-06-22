import { UserModel } from "../../domains/User";
import { IFriendPresenter } from "../../presenter";

export interface IGetAllFriendRepo {
  getAllFriend(): Promise<UserModel[]>;
}

export default class GetAllFriendUseCase {
  private repository: IGetAllFriendRepo;
  private presenter: IFriendPresenter;

  constructor(repository: IGetAllFriendRepo, presenter: IFriendPresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  async execute() {
    try {
      const res = await this.repository.getAllFriend();

      this.presenter.addFriends(res);
    } catch (e) {
      console.log(e);
    }
  }
}
