//Data source
import UserSocketDataSource from "../../dataSource/User/userSocketDataSouce";

//Domain

//Network
import { Socket } from "../../network";

//Repo
import UserRepository from "../../repository/User/userRepository";

//Use case
import ListenUserOnlineUseCase from "../../useCases/User/listenUserOnlineUseCase";

//Presenter
import { IUserPresenter } from "../../presenter";
import ListenUserOfflineUseCase from "../../useCases/User/listenUserOfflineUseCase";

export default class UserController {
  private presenter: IUserPresenter;

  constructor(presenter: IUserPresenter) {
    this.presenter = presenter;
  }

  listenUserOnline() {
    const listenUserOnlineUseCase = new ListenUserOnlineUseCase(
      new UserRepository(new UserSocketDataSource(Socket.getIntance())),
      this.presenter
    );

    listenUserOnlineUseCase.execute();
  }

  litenUserOffline() {
    const listenUserOffline = new ListenUserOfflineUseCase(
      new UserRepository(new UserSocketDataSource(Socket.getIntance())),
      this.presenter
    );

    listenUserOffline.execute();
  }
}
