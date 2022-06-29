import {
  FileDataSource,
  MessageCacheDataSource,
  MessageStorageDataSource,
} from "../../dataSource";
import {
  IFile,
  IMessage,
  IQueryOption,
  MessageModel,
  MessageType,
  modelMessageData,
} from "../../domains";
import { API } from "../../network";
import { IMessagePresenter } from "../../presenter";
import { FileRepository, MessageStorageRepository } from "../../repository";
import { CacheStorage, IndexedDB } from "../../storage";
import {
  AddMessageDatabaseUseCase,
  GetMessageByConversationUseCase,
  ReceiveMessageUseCase,
  RetryMessageUseCase,
  SendMessageUseCase,
  SyncMessageUseCase,
  UpdateMessageUseCase,
  UploadFileUseCase,
} from "../../useCases";

export class MessageController {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  async getMessagesByConversation(
    conversationId: string,
    options?: IQueryOption
  ) {
    let result: MessageModel[] = [];
    try {
      const getMessageFromCacheUseCase = new GetMessageByConversationUseCase(
        new MessageStorageRepository(
          new MessageCacheDataSource(CacheStorage.getInstance())
        ),
        this.presenter
      );

      result = await getMessageFromCacheUseCase.execute(conversationId);
    } catch (e) {
      console.log(e);
    }

    if (result.length < 10) {
      try {
        this.presenter.removeAllMessage();

        const getMessageFromDBUseCase = new GetMessageByConversationUseCase(
          new MessageStorageRepository(
            new MessageStorageDataSource(IndexedDB.getInstance())
          ),
          this.presenter
        );

        getMessageFromDBUseCase.execute(conversationId, options);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async getMessagesByConversationFromDB(
    conversationId: string,
    options?: IQueryOption
  ) {
    try {
      const getMessageFromDBUseCase = new GetMessageByConversationUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      const res = await getMessageFromDBUseCase.execute(
        conversationId,
        options
      );

      return res;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  addMessageToCache(messages: IMessage | IMessage[]) {
    try {
      const addMessageToCacheUseCase = new AddMessageDatabaseUseCase(
        new MessageStorageRepository(
          new MessageCacheDataSource(CacheStorage.getInstance())
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
    } catch (e) {
      console.log(e);
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
      this.presenter.setShowNotification(true);
      console.log("Upload error: ", e);
      return;
    }

    try {
      const sendMessageUseCase = new SendMessageUseCase(this.presenter);

      const messageModel = modelMessageData(message);

      sendMessageUseCase.execute(messageModel);
    } catch (e) {
      console.log(e);
    }
  }

  receiveMessage(message: IMessage, addToCache: boolean) {
    try {
      const receiveMessageUseCase = new ReceiveMessageUseCase(this.presenter);

      const messageModel = modelMessageData(message);

      receiveMessageUseCase.execute(messageModel);

      if (addToCache) {
        const addMessageDatabaseUseCase = new AddMessageDatabaseUseCase(
          new MessageStorageRepository(
            new MessageCacheDataSource(CacheStorage.getInstance())
          )
        );

        addMessageDatabaseUseCase.execute(messageModel);
      }
    } catch (e) {
      console.log(e);
    }
  }

  updateMessage(message: IMessage, updateCache: boolean) {
    let messageModel: MessageModel;

    try {
      const updateMessageUseCase = new UpdateMessageUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      messageModel = modelMessageData(message);

      updateMessageUseCase.execute(messageModel);
    } catch (e) {
      console.log(e);
      return;
    }

    if (updateCache) {
      try {
        const updateCacheMessage = new UpdateMessageUseCase(
          new MessageStorageRepository(
            new MessageCacheDataSource(CacheStorage.getInstance())
          )
        );

        updateCacheMessage.execute(messageModel);
      } catch (e) {
        console.log(e);
      }
    }
  }

  syncMessage() {
    try {
      const syncMessageUseCase = new SyncMessageUseCase();

      syncMessageUseCase.execute();
    } catch (e) {
      console.log(e);
    }
  }

  retryMessage(message: IMessage) {
    try {
      const retryMessageUseCase = new RetryMessageUseCase(this.presenter);

      const messageModel = modelMessageData(message);

      retryMessageUseCase.execute(messageModel);
    } catch (e) {
      console.log(e);
    }
  }
}
