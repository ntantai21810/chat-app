//Data source
import { IMessage, modelMessageData } from "../../domains/Message";

//Presenter
import { IMessagePresenter } from "../../presenter";

//Repo

//DB
import IndexedDB from "../../storage/indexedDB";

//Use case
import MessageStorageDataSource from "../../dataSource/Message/messageStorageDataSource";
import MessageDatabaseRepository from "../../repository/Message/messageDatabaseRepository";
import GetMessageUseCase from "../../useCases/Message/getMessageByConversationUseCase";
import ReceiveMessageUseCase from "../../useCases/Message/receiveMessageUseCase";
import SendMessageUseCase from "../../useCases/Message/sendMessageUseCase";
import MessageCacheDataSource from "../../dataSource/Message/messageCacheDataSource";
import Cache from "../../storage/cache";
import AddMessageDatabaseUseCase from "../../useCases/Message/addMessageDatabaseUseCase";
import { IQueryOption } from "../../domains/common/helper";

export default class MessageController {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  async getMessagesByConversation(
    conversationId: string,
    options?: IQueryOption
  ) {
    const getMessageFromCacheUseCase = new GetMessageUseCase(
      new MessageDatabaseRepository(
        new MessageCacheDataSource(Cache.getInstance())
      ),
      this.presenter
    );

    const result = await getMessageFromCacheUseCase.execute(conversationId);

    if (result.length <= 10) {
      const getMessageFromDBUseCase = new GetMessageUseCase(
        new MessageDatabaseRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      getMessageFromDBUseCase.execute(conversationId, options);
    }
  }

  async getMessagesByConversationFromDB(
    conversationId: string,
    options?: IQueryOption
  ) {
    const getMessageFromDBUseCase = new GetMessageUseCase(
      new MessageDatabaseRepository(
        new MessageStorageDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    const res = await getMessageFromDBUseCase.execute(conversationId, options);

    return res;
  }

  addMessageToCache(messages: IMessage | IMessage[]) {
    const addMessageToCacheUseCase = new AddMessageDatabaseUseCase(
      new MessageDatabaseRepository(
        new MessageCacheDataSource(Cache.getInstance())
      )
    );

    if (Array.isArray(messages)) {
      for (let message of messages) {
        const messageModel = modelMessageData(message);
        addMessageToCacheUseCase.execute(messageModel);
      }
    } else {
      const messageModel = modelMessageData(messages);
      addMessageToCacheUseCase.execute(messageModel);
    }
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
