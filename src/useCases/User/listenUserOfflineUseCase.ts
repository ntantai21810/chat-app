import { UserModel } from "../../domains/User";
import { SOCKET_CONSTANTS } from "../../helper/constants";
import { IUserPresenter } from "../../presenter";

export interface IListenUserOfflineRepo {
  listenUserOffline(channel: string, callback: (user: UserModel) => void): void;
}

export default class ListenUserOfflineUseCase {
  private repository: IListenUserOfflineRepo;
  private presenter: IUserPresenter;

  constructor(repository: IListenUserOfflineRepo, presenter: IUserPresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute() {
    this.repository.listenUserOffline(
      SOCKET_CONSTANTS.USER_DISCONNECT,
      (user) => {
        console.log("Offline: ", { user });
        this.presenter.removeUserOnline(user);
      }
    );
  }
}
