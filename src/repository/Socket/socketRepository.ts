import { ISocketDataSource } from "../../dataSource/Socket";
import { IConnectSocketRepo } from "../../useCases";
import {} from "./../../dataSource/Auth/IAuthDataSource";

export default class SocketRepository implements IConnectSocketRepo {
  private dataSource: ISocketDataSource;

  constructor(dataSource: ISocketDataSource) {
    this.dataSource = dataSource;
  }

  connect(userId: string, accessToken: string): void {
    this.dataSource.connect(userId, accessToken);
  }
}
