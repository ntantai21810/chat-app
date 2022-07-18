import { v4 as uuidv4 } from "uuid";
import {
  MessageSocketDataSource,
  MessageStorageDataSource,
} from "../../dataSource";
import { MessageModel, MessageStatus } from "../../domains";
import { Socket } from "../../network";
import { IMessagePresenter } from "../../presenter";
import {
  MessageSocketRepository,
  MessageStorageRepository,
} from "../../repository";
import { IndexedDB } from "../../storage";
import { DeleteMessageUseCase } from "./deleteMessageUseCase";
import { SendMessageSocketUseCase } from "./sendMessageSocketUseCase";

export class RetryMessageUseCase {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    try {
      const sendMessageSocketUseCase = new SendMessageSocketUseCase(
        new MessageSocketRepository(
          new MessageSocketDataSource(Socket.getIntance())
        )
      );

      const newMessageModel = new MessageModel(
        messageModel.getFromId(),
        messageModel.getToId(),
        messageModel.getConversationId(),
        messageModel.getType(),
        messageModel.getContent(),
        uuidv4(),
        new Date().toISOString(),
        MessageStatus.PENDING
      );

      await sendMessageSocketUseCase.execute(newMessageModel, false);

      const deleteMessageUseCase = new DeleteMessageUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      deleteMessageUseCase.execute(messageModel);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
