import { IConnectSocketRepo } from "../../useCases";
import { IDisconnectSocketRepo } from "../../useCases/Socket/disconnectSocketUseCase";
import { IListenSocketRepo } from "../../useCases/Socket/listenSocketUseCase";
import { IRemoveAllListenerSocketRepo } from "../../useCases/Socket/removeAllListenerSocketUseCase";
import { ISendSocketRepo } from "../../useCases/Socket/sendSocketUseCase";

export interface ISocketDataSource {
  connect(userId: string, accessToken: string): void;
  disconnect(): void;
  listen(channel: string, callback: Function): void;
  send(channel: string, data: any): void;
  removeAllListener(channel: string): void;
}
export default class SocketRepository
  implements
    IConnectSocketRepo,
    IDisconnectSocketRepo,
    IListenSocketRepo,
    ISendSocketRepo,
    IRemoveAllListenerSocketRepo
{
  private dataSource: ISocketDataSource;

  constructor(dataSource: ISocketDataSource) {
    this.dataSource = dataSource;
  }

  connect(userId: string, accessToken: string): void {
    this.dataSource.connect(userId, accessToken);
  }

  disconnect(): void {
    this.dataSource.disconnect();
  }

  listen(channel: string, callback: Function): void {
    this.dataSource.listen(channel, callback);
  }

  send(channel: string, data: any): void {
    this.dataSource.send(channel, data);
  }

  removeAllListener(channel: string): void {
    this.dataSource.removeAllListener(channel);
  }
}
