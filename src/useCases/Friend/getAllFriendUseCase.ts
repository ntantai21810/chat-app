import { UserModel } from "../../domains";
import { IFriendPresenter } from "../../presenter";

export interface IGetAllFriendRepo {
  getAllFriend(): Promise<UserModel[]>;
}

export class GetAllFriendUseCase {
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
      throw e;
    }
  }
}
