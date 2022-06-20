//Data source
import { IMessage, modelMessageData } from "../../domains/Message";

//Presenter
import { IMessagePresenter } from "../../presenter";

//Repo

//DB
import IndexedDB from "../../storage/indexedDB";

//Use case
import MessageDatabaseDataSource from "../../dataSource/Message/messageDatabaseDataSource";
import MessageDatabaseRepository from "../../repository/Message/messageDatabaseRepository";
import GetMessageUseCase from "../../useCases/Message/getMessageByConversationUseCase";
import ReceiveMessageUseCase from "../../useCases/Message/receiveMessageUseCase";
import SendMessageUseCase from "../../useCases/Message/sendMessageUseCase";

export default class MessageController {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  getMessagesByConversation(conversationId: string) {
    const messageUseCase = new GetMessageUseCase(
      new MessageDatabaseRepository(
        new MessageDatabaseDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    messageUseCase.execute(conversationId);
  }

  sendMessage(message: IMessage) {
    const sendMessageUseCase = new SendMessageUseCase(this.presenter);

    const messageModel = modelMessageData(message);

    sendMessageUseCase.execute(messageModel);
  }

  receiveMessage(message: IMessage, addToCache: boolean) {
    const receiveMessageUseCase = new ReceiveMessageUseCase(this.presenter);

    const messageModel = modelMessageData(message);

    receiveMessageUseCase.execute(messageModel, addToCache);
  }
}
