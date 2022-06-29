import { FriendDataSource } from "../../dataSource";
import { IFriendPresenter } from "../../presenter";
import { FriendStorageRepository } from "../../repository";
import { IndexedDB } from "../../storage";
import { GetAllFriendUseCase } from "../../useCases";

export class FriendController {
  private presenter: IFriendPresenter;

  constructor(presenter: IFriendPresenter) {
    this.presenter = presenter;
  }

  getAllFriend() {
    try {
      const getAllFriendUseCase = new GetAllFriendUseCase(
        new FriendStorageRepository(
          new FriendDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      getAllFriendUseCase.execute();
    } catch (e) {
      console.log(e);
    }
  }
}
