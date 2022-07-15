import { FileDataSource, MessageStorageDataSource } from "../../dataSource";
import {
  IFile,
  IMessage,
  MessageModel,
  MessageType,
  modelMessageData,
  normalizeMessageData,
} from "../../domains";
import { API } from "../../network";
import { IMessagePresenter } from "../../presenter";
import { FileRepository, MessageStorageRepository } from "../../repository";
import { IndexedDB } from "../../storage";
import {
  GetMessageByConversationUseCase,
  ReceiveMessageUseCase,
  RetryMessageUseCase,
  SearchMessageUseCase,
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
    fromMessage?: IMessage,
    toMessage?: IMessage,
    limit?: number,
    exceptBound?: boolean
  ): Promise<IMessage[]> {
    let result: MessageModel[] = [];

    const fromMessageModel = fromMessage
      ? modelMessageData(fromMessage)
      : undefined;
    const toMessageModel = toMessage ? modelMessageData(toMessage) : undefined;

    try {
      if (!fromMessage && !toMessage) {
        this.presenter.removeAllMessage();
      }

      const getMessageFromDBUseCase = new GetMessageByConversationUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      result = await getMessageFromDBUseCase.execute(
        conversationId,
        fromMessageModel,
        toMessageModel,
        limit,
        exceptBound
      );
    } catch (e) {
      console.log(e);
      return [];
    }

    const messages: IMessage[] = [];

    for (let messageModel of result) {
      messages.push(normalizeMessageData(messageModel));
    }

    return messages;
  }

  async loadMoreMessage(
    conversationId: string,
    toMessage: IMessage,
    limit: number = 15
  ): Promise<IMessage[]> {
    try {
      const getMessageFromDBUseCase = new GetMessageByConversationUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      const toMessageModel = modelMessageData(toMessage);

      const res = await getMessageFromDBUseCase.execute(
        conversationId,
        undefined,
        toMessageModel,
        limit,
        true
      );

      const messages: IMessage[] = [];

      for (let messageModel of res) {
        messages.push(normalizeMessageData(messageModel));
      }

      return messages;
    } catch (e) {
      console.log(e);
      return [];
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
      return;
    }

    try {
      const sendMessageUseCase = new SendMessageUseCase(this.presenter);

      const messageModel = modelMessageData(message);

      await sendMessageUseCase.execute(messageModel);
    } catch (e) {
      console.log(e);
    }
  }

  async receiveMessage(message: IMessage, show: boolean) {
    try {
      const receiveMessageUseCase = new ReceiveMessageUseCase(
        show ? undefined : this.presenter
      );

      const messageModel = modelMessageData(message);

      await receiveMessageUseCase.execute(messageModel);
    } catch (e) {
      console.log(e);
    }
  }

  updateMessage(message: IMessage) {
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

  async searchMessage(text: string): Promise<IMessage[]> {
    try {
      const searchMessageUseCase = new SearchMessageUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        )
      );

      const res = await searchMessageUseCase.execute(text);

      const messages: IMessage[] = [];

      for (let messageModel of res) {
        const message = normalizeMessageData(messageModel);

        messages.push(message);
      }

      return messages;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
