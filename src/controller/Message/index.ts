import { getDispatch } from "../../adapter/frameworkAdapter";
import {
  CommonDataSource,
  FileDataSource,
  MessageStorageDataSource,
} from "../../dataSource";
import {
  IFile,
  IMessage,
  MessageModel,
  MessageStatus,
  MessageType,
  modelMessageData,
  normalizeMessageData,
} from "../../domains";
import { updateOneMessage } from "../../framework/redux";
import { IMessagePresenter } from "../../presenter";
import {
  CommonRepository,
  FileRepository,
  MessageStorageRepository,
} from "../../repository";
import { IndexedDB } from "../../storage";
import {
  DeleteMessageUseCase,
  GetMessageByConversationUseCase,
  GetMessageTypeByConversationUseCase,
  PreviewLinkUseCase,
  ReceiveMessageUseCase,
  RetryMessageUseCase,
  SearchMessageUseCase,
  SendMessageUseCase,
  SyncMessageUseCase,
  UpdateMessageUseCase,
  UploadFileUseCase,
} from "../../useCases";
import { API } from "./../../network/api/API";

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

  async getMessagesTypeByConversation(
    conversationId: string,
    type: MessageType,
    fromMessage: IMessage,
    limit?: number
  ): Promise<IMessage[]> {
    let result: MessageModel[] = [];

    const fromMessageModel = modelMessageData(fromMessage);

    try {
      const getMessageFromDBUseCase = new GetMessageTypeByConversationUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        )
      );

      result = await getMessageFromDBUseCase.execute(
        conversationId,
        type,
        fromMessageModel,
        limit
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
    const uploadFileUseCase = new UploadFileUseCase(
      new FileRepository(new FileDataSource(API.getIntance()))
    );

    const sendMessageUseCase = new SendMessageUseCase(this.presenter);

    if (
      message.type === MessageType.IMAGE ||
      message.type === MessageType.FILE
    ) {
      try {
        const urls = await uploadFileUseCase.execute(
          message.content as IFile[]
        );

        message.content = (message.content as IFile[]).map((item, index) => ({
          ...item,
          data: urls[index],
        }));

        const messageModel = modelMessageData(message);

        sendMessageUseCase.execute(messageModel);
      } catch (e) {
        if (message.type === MessageType.FILE) {
          for (let file of message.content as IFile[]) {
            file.data = "";
          }
        }

        message.status = MessageStatus.ERROR;

        const messageModel = modelMessageData(message);

        sendMessageUseCase.execute(messageModel, false);

        this.presenter.setShowNotification(true);
      }
    } else {
      const messageModel = modelMessageData(message);

      try {
        await sendMessageUseCase.execute(messageModel);
      } catch (e) {
        console.log(e);
      }
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

  async deleteMessage(message: IMessage) {
    let messageModel: MessageModel;

    try {
      const deleteMessageUseCase = new DeleteMessageUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      messageModel = modelMessageData(message);

      await deleteMessageUseCase.execute(messageModel);
    } catch (e) {
      console.log(e);
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

  async retryMessage(message: IMessage) {
    try {
      const retryMessageUseCase = new RetryMessageUseCase(this.presenter);

      const messageModel = modelMessageData(message);

      await retryMessageUseCase.execute(messageModel);
    } catch (e) {
      throw e;
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

  async createMessageThumb(messages: IMessage[]): Promise<void> {
    try {
      const previewLinkUseCase = new PreviewLinkUseCase(
        new CommonRepository(new CommonDataSource(API.getIntance()))
      );
      const updateMessageUseCase = new UpdateMessageUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        )
      );
      const dispatch = getDispatch();

      for (let message of messages) {
        if (message.type === MessageType.TEXT) {
          const match = (message.content as string).match(/\bhttps?:\/\/\S+/i);

          const url = match && match[0] ? match[0] : "";

          if (url && !message.thumb) {
            try {
              const thumb = await previewLinkUseCase.execute(url);
              const messageModel = modelMessageData({
                fromId: message.fromId,
                toId: message.toId,
                clientId: message.clientId,
                conversationId: message.conversationId,
                thumb,
              } as any);

              dispatch(
                updateOneMessage({
                  fromId: message.fromId,
                  toId: message.toId,
                  clientId: message.clientId,
                  thumb,
                } as any)
              );

              updateMessageUseCase.execute(messageModel);
            } catch (e) {
              console.log(e);
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
