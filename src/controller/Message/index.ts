//Data source
import { MessageIndexedDataSource } from "../../dataSource";
import MessageSocketDataSource from "../../dataSource/Message/messageSocketDataSource";
import MessageIndexedDBDataSource from "../../dataSource/Message/messageStorageDataSource";
import { IMessage, modelMessageData } from "../../domains/Message";
import { Socket } from "../../network";

//Presenter
import { IMessagePresenter } from "../../presenter";

//Repo
import MessageRepository from "../../repository/Message/messageRepository";

//DB
import IndexedDB from "../../storage/indexedDB";

//Use case
import ConnectDBMessageUseCase from "../../useCases/Message/connectDBUseCase";
import GetMessageUseCase from "../../useCases/Message/getMessageUseCase";
import ListenMessageUseCase from "../../useCases/Message/listenMessageUseCase";
import SendMessageUseCase from "../../useCases/Message/sendMessageUseCase";

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

  sendMessage(message: IMessage) {
    const sendMessageUseCase = new SendMessageUseCase(
      new MessageRepository(
        new MessageIndexedDataSource(IndexedDB.getInstance()),
        Socket.getIntance()
      ),
      this.presenter
    );

    const messageModel = modelMessageData(message);

    sendMessageUseCase.execute(messageModel);
  }

  listenMessage() {
    const listenMessageUseCase = new ListenMessageUseCase(
      new MessageRepository(new MessageSocketDataSource(Socket.getIntance())),
      this.presenter
    );

    listenMessageUseCase.execute();
  }
}
