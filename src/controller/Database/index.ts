import { DatabaseDataSource } from "../../dataSource";
import { IDatabasePresenter } from "../../presenter";
import { DatabaseRepository } from "../../repository";
import { IndexedDB } from "../../storage";
import { ConnectDatabaseUseCase } from "../../useCases";

export class DatabaseController {
  private presenter: IDatabasePresenter;

  constructor(presenter: IDatabasePresenter) {
    this.presenter = presenter;
  }

  connect(name: string, userId: string) {
    try {
      const connectDatabaseUseCase = new ConnectDatabaseUseCase(
        new DatabaseRepository(new DatabaseDataSource(IndexedDB.getInstance())),
        this.presenter
      );

      connectDatabaseUseCase.execute(name, userId);
    } catch (e) {
      console.log(e);
    }
  }
}
