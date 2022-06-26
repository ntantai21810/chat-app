import { IFile } from "./../../domains/common/helper";
//Data source
import { IMessage, MessageType, modelMessageData } from "../../domains/Message";

//Presenter
import { IMessagePresenter } from "../../presenter";

//Repo

//DB
import IndexedDB from "../../storage/indexedDB";

//Use case
import MessageStorageDataSource from "../../dataSource/Message/messageStorageDataSource";
import MessageStorageRepository from "../../repository/Message/messageStorageRepository";
import GetMessageUseCase from "../../useCases/Message/getMessageByConversationUseCase";
import ReceiveMessageUseCase from "../../useCases/Message/receiveMessageUseCase";
import SendMessageUseCase from "../../useCases/Message/sendMessageUseCase";
import MessageCacheDataSource from "../../dataSource/Message/messageCacheDataSource";
import Cache from "../../storage/cache";
import AddMessageDatabaseUseCase from "../../useCases/Message/addMessageDatabaseUseCase";
import { IQueryOption } from "../../domains/common/helper";
import UpdateMessageUseCase from "../../useCases/Message/updateMessageUseCase";
import SyncMessageUseCase from "../../useCases/Message/syncMessageUseCase";
import UploadFileUseCase from "../../useCases/File/uploadFileUseCase";
import FileRepository from "../../repository/File/fileRepository";
import FileDataSource from "../../dataSource/File/fileDataSouce";
import API from "../../network/api/API";
import RetryMessageUseCase from "../../useCases/Message/retryMessageUseCase";

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
      new MessageStorageRepository(
        new MessageCacheDataSource(Cache.getInstance())
      ),
      this.presenter
    );

    const result = await getMessageFromCacheUseCase.execute(conversationId);

    if (result.length < 10) {
      const getMessageFromDBUseCase = new GetMessageUseCase(
        new MessageStorageRepository(
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
      new MessageStorageRepository(
        new MessageStorageDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    const res = await getMessageFromDBUseCase.execute(conversationId, options);

    return res;
  }

  addMessageToCache(messages: IMessage | IMessage[]) {
    const addMessageToCacheUseCase = new AddMessageDatabaseUseCase(
      new MessageStorageRepository(
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

  async sendMessage(message: IMessage) {
    try {
      if (
        message.type === MessageType.IMAGE ||
        message.type === MessageType.FILE
      ) {
        const uploadFileUseCase = new UploadFileUseCase(
          new FileRepository(new FileDataSource(API.getIntance()))
        );

        const imageUrls = await uploadFileUseCase.execute(
          message.content as IFile[]
        );

        message.content = (message.content as IFile[]).map((item, index) => ({
          ...item,
          data: imageUrls[index],
        }));
      }
    } catch (e) {
      console.log("Upload error: ", e);
      return;
    }

    const sendMessageUseCase = new SendMessageUseCase(this.presenter);

    const messageModel = modelMessageData(message);

    sendMessageUseCase.execute(messageModel);
  }

  receiveMessage(message: IMessage, addToCache: boolean) {
    const receiveMessageUseCase = new ReceiveMessageUseCase(this.presenter);

    const messageModel = modelMessageData(message);

    receiveMessageUseCase.execute(messageModel);

    if (addToCache) {
      const addMessageDatabaseUseCase = new AddMessageDatabaseUseCase(
        new MessageStorageRepository(
          new MessageCacheDataSource(Cache.getInstance())
        )
      );

      addMessageDatabaseUseCase.execute(messageModel);
    }
  }

  updateMessage(message: IMessage, updateCache: boolean) {
    const updateMessageUseCase = new UpdateMessageUseCase(
      new MessageStorageRepository(
        new MessageStorageDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    const messageModel = modelMessageData(message);

    updateMessageUseCase.execute(messageModel);

    if (updateCache) {
      const updateCacheMessage = new UpdateMessageUseCase(
        new MessageStorageRepository(
          new MessageCacheDataSource(Cache.getInstance())
        )
      );

      updateCacheMessage.execute(messageModel);
    }
  }

  syncMessage() {
    const syncMessageUseCase = new SyncMessageUseCase();

    syncMessageUseCase.execute();
  }

  retryMessage(message: IMessage) {
    const retryMessageUseCase = new RetryMessageUseCase(this.presenter);

    const messageModel = modelMessageData(message);

    retryMessageUseCase.execute(messageModel);
  }
}
