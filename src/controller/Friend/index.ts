//Data source

//Domain

//Repo

//Use case

//Presenter
import FriendDataSource from "../../dataSource/Friend/friendDataSouce";
import { IFriendPresenter } from "../../presenter";
import FriendStorageRepository from "../../repository/Friend/friendStorageRepository";
import IndexedDB from "../../storage/indexedDB";
import GetAllFriendUseCase from "../../useCases/Friend/getAllFriendUseCase";

export default class FriendController {
  private presenter: IFriendPresenter;

  constructor(presenter: IFriendPresenter) {
    this.presenter = presenter;
  }

  getAllFriend() {
    const getAllFriendUseCase = new GetAllFriendUseCase(
      new FriendStorageRepository(
        new FriendDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    getAllFriendUseCase.execute();
  }
}
