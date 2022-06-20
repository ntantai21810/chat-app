import SocketRepository from "../../repository/Socket/socketRepository";

//Use case
import ConnectSocketUseCase from "../../useCases/Socket/connectSocketUseCase";

//Presenter
import SocketDataSource from "../../dataSource/Socket/socketDataSouce";
import Socket from "../../network/socket/socket";
import { IDatabasePresenter } from "../../presenter/Database";
import DisconnectSocketUseCase from "../../useCases/Socket/disconnectSocketUseCase";
import ConnectDatabaseUseCase from "../../useCases/Database/connectDatabaseUseCase";
import DatabaseRepository from "../../repository/Database/databaseRepository";
import DatabaseDataSource from "../../dataSource/Database/databaseDataSouce";
import IndexedDB from "../../storage/indexedDB";

export default class DatabaseController {
  private presenter: IDatabasePresenter;

  constructor(presenter: IDatabasePresenter) {
    this.presenter = presenter;
  }

  connect(name: string, userId: string) {
    const connectDatabaseUseCase = new ConnectDatabaseUseCase(
      new DatabaseRepository(new DatabaseDataSource(IndexedDB.getInstance())),
      this.presenter
    );

    connectDatabaseUseCase.execute(name, userId);
  }
}
