//Data source
import MessageIndexedDBDataSource from "../../dataSource/Message/messageStorageDataSouce";

//Presenter
import { IMessagePresenter } from "../../presenter";

//Repo
import MessageRepository from "../../repository/Message/messageRepository";

//DB
import IndexedDB from "../../storage/indexedDB";

//Use case
import ConnectDBMessageUseCase from "../../useCases/Message/connectDBUseCase";
import GetMessageUseCase from "../../useCases/Message/getMessageUseCase";

export default class MessageController {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  connectDB() {
    const connectDBUseCase = new ConnectDBMessageUseCase(
      new MessageRepository(
        new MessageIndexedDBDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    connectDBUseCase.execute();
  }

  getMessages(myId: string, otherId: string) {
    const messageUseCase = new GetMessageUseCase(
      new MessageRepository(
        new MessageIndexedDBDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    messageUseCase.execute(myId, otherId);
  }
}
