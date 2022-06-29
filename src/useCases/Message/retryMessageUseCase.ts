import { v4 as uuidv4 } from "uuid";
import { MessageStorageDataSource } from "../../dataSource";
import { MessageModel, MessageStatus } from "../../domains";
import { IMessagePresenter } from "../../presenter";
import { MessageStorageRepository } from "../../repository";
import { IndexedDB } from "../../storage";
import { DeleteMessageUseCase } from "./deleteMessageUseCase";
import { SendMessageUseCase } from "./sendMessageUseCase";

export class RetryMessageUseCase {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    try {
      const sendMessageUseCase = new SendMessageUseCase(this.presenter);

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

      sendMessageUseCase.execute(newMessageModel);

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
