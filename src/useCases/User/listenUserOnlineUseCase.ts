import { UserModel } from "../../domains/User";
import { SOCKET_CONSTANTS } from "../../helper/constants";
import { IUserPresenter } from "../../presenter";

export interface IListenUserOnlineRepo {
  listenUserOnline(
    channel: string,
    callback: (users: UserModel | UserModel[]) => void
  ): void;

  signal(): void;
}

export default class ListenUserOnlineUseCase {
  private repository: IListenUserOnlineRepo;
  private presenter: IUserPresenter;

  constructor(repository: IListenUserOnlineRepo, presenter: IUserPresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute() {
    this.repository.listenUserOnline(SOCKET_CONSTANTS.USER_CONNECT, (users) => {
      console.log("Online: ", { users });
      this.presenter.addUserOnline(users);
    });

    this.repository.signal();
  }
}
