import { SocketDataSource } from "../../dataSource";
import { Socket } from "../../network";
import { ISocketPresenter } from "../../presenter";
import { SocketRepository } from "../../repository";
import {
  ConnectSocketUseCase,
  DisconnectSocketUseCase,
  ListenSocketUseCase,
  RemoveListenerSocketUseCase,
  SendSocketUseCase,
} from "../../useCases";

export class SocketController {
  private presenter: ISocketPresenter;

  constructor(presenter: ISocketPresenter) {
    this.presenter = presenter;
  }

  connect(userId: string, accessToken: string) {
    try {
      const connectSocketUseCase = new ConnectSocketUseCase(
        new SocketRepository(new SocketDataSource(Socket.getIntance())),
        this.presenter
      );

      connectSocketUseCase.execute(userId, accessToken);
    } catch (e) {
      console.log(e);
    }
  }

  disconnect() {
    try {
      const disconnectSocketUseCase = new DisconnectSocketUseCase(
        new SocketRepository(new SocketDataSource(Socket.getIntance())),
        this.presenter
      );

      disconnectSocketUseCase.execute();
    } catch (e) {
      console.log(e);
    }
  }

  listen(channel: string, callback: Function) {
    try {
      const listenSocketUseCase = new ListenSocketUseCase(
        new SocketRepository(new SocketDataSource(Socket.getIntance()))
      );

      listenSocketUseCase.execute(channel, callback);
    } catch (e) {
      console.log(e);
    }
  }

  removeListener(
    channel: string,
    listener?: (...args: any[]) => void | undefined
  ) {
    try {
      const removeListenerUseCase = new RemoveListenerSocketUseCase(
        new SocketRepository(new SocketDataSource(Socket.getIntance()))
      );

      removeListenerUseCase.execute(channel, listener);
    } catch (e) {
      console.log(e);
    }
  }

  send(channel: string, data: any) {
    try {
      const sendSocketUseCase = new SendSocketUseCase(
        new SocketRepository(new SocketDataSource(Socket.getIntance()))
      );

      sendSocketUseCase.execute(channel, data);
    } catch (e) {
      console.log(e);
    }
  }
}
