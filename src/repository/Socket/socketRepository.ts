import {
  IConnectSocketRepo,
  IDisconnectSocketRepo,
  IListenSocketRepo,
  IRemoveListenerSocketRepo,
  ISendSocketRepo,
} from "../../useCases";

export interface ISocketDataSource {
  connect(userId: string, accessToken: string): void;
  disconnect(): void;
  listen(channel: string, callback: Function): void;
  send(channel: string, data: any): void;
  removeListener(
    channel: string,
    listener?: (...args: any[]) => void | undefined
  ): void;
}
export class SocketRepository
  implements
    IConnectSocketRepo,
    IDisconnectSocketRepo,
    IListenSocketRepo,
    ISendSocketRepo,
    IRemoveListenerSocketRepo
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

  removeListener(
    channel: string,
    listener?: (...args: any[]) => void | undefined
  ): void {
    this.dataSource.removeListener(channel, listener);
  }
}
