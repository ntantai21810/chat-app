import SocketRepository from "../../repository/Socket/socketRepository";

//Use case
import ConnectSocketUseCase from "../../useCases/Socket/connectSocketUseCase";

//Presenter
import SocketDataSource from "../../dataSource/Socket/socketDataSouce";
import Socket from "../../network/socket/socket";
import { ISocketPresenter } from "../../presenter";
import DisconnectSocketUseCase from "../../useCases/Socket/disconnectSocketUseCase";
import ListenSocketUseCase from "../../useCases/Socket/listenSocketUseCase";
import SendSocketUseCase from "../../useCases/Socket/sendSocketUseCase";
import RemoveAllListenerSocketUseCase from "../../useCases/Socket/removeAllListenerSocketUseCase";

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

  listen(channel: string, callback: Function) {
    const listenSocketUseCase = new ListenSocketUseCase(
      new SocketRepository(new SocketDataSource(Socket.getIntance()))
    );

    listenSocketUseCase.execute(channel, callback);
  }

  removeAllListener(channel: string) {
    const removeAllListenerUseCase = new RemoveAllListenerSocketUseCase(
      new SocketRepository(new SocketDataSource(Socket.getIntance()))
    );

    removeAllListenerUseCase.execute(channel);
  }

  send(channel: string, data: any) {
    const sendSocketUseCase = new SendSocketUseCase(
      new SocketRepository(new SocketDataSource(Socket.getIntance()))
    );

    sendSocketUseCase.execute(channel, data);
  }
}
