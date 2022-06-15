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
import ListenTypingUseCase from "../../useCases/Message/listenTypingUseCase";
import RemoveListenTypingUseCase from "../../useCases/Message/removeListenTypingUseCase";
import SendMessageUseCase from "../../useCases/Message/sendMessageUseCase";
import SendTypingUseCase from "../../useCases/Message/sendTypingUseCase";

export default class MessageController {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  connectDB(name: string, userId: string) {
    const connectDBUseCase = new ConnectDBMessageUseCase(
      new MessageRepository(
        new MessageIndexedDBDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    connectDBUseCase.execute(name, userId);
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

  sendTyping(toUserId: string, isTyping: boolean) {
    const sendTyping = new SendTypingUseCase(
      new MessageRepository(new MessageSocketDataSource(Socket.getIntance()))
    );

    sendTyping.execute(toUserId, isTyping);
  }

  listenTyping(userId: string) {
    const listenTypingUseCase = new ListenTypingUseCase(
      new MessageRepository(new MessageSocketDataSource(Socket.getIntance())),
      this.presenter
    );

    listenTypingUseCase.execute(userId);
  }

  removeListenTyping() {
    const removeListenTyping = new RemoveListenTypingUseCase(
      new MessageRepository(new MessageSocketDataSource(Socket.getIntance()))
    );

    removeListenTyping.execute();
  }
}
