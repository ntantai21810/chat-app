import { ISocketDataSource } from "../../dataSource/Socket";
import { IConnectSocketRepo } from "../../useCases";
import { IDisconnectSocketRepo } from "../../useCases/Socket/disconnectSocketUseCase";
import {} from "./../../dataSource/Auth/IAuthDataSource";

export default class SocketRepository
  implements IConnectSocketRepo, IDisconnectSocketRepo
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
}
