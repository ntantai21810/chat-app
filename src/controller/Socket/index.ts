//Data source
import { SocketDataSource } from "../../dataSource/Socket";

//Domain

//Network
import { Socket } from "../../network";

//Repo
import SocketRepository from "../../repository/Socket/socketRepository";

//Use case
import ConnectSocketUseCase from "../../useCases/Socket/connectSocketUseCase";

//Presenter
import { ISocketPresenter } from "../../presenter";
import DisconnectSocketUseCase from "../../useCases/Socket/disconnectSocketUseCase";

export default class SocketController {
  private presenter: ISocketPresenter;

  constructor(presenter: ISocketPresenter) {
    this.presenter = presenter;
  }

  connect(userId: string, accessToken: string) {
    const connectSocketUseCase = new ConnectSocketUseCase(
      new SocketRepository(new SocketDataSource(Socket.getIntance())),
      this.presenter
    );

    connectSocketUseCase.execute(userId, accessToken);
  }

  disconnect() {
    const disconnectSocketUseCase = new DisconnectSocketUseCase(
      new SocketRepository(new SocketDataSource(Socket.getIntance())),
      this.presenter
    );

    disconnectSocketUseCase.execute();
  }
}
