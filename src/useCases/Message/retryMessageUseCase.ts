import MessageStorageDataSource from "../../dataSource/Message/messageStorageDataSource";
import { MessageModel, MessageStatus } from "../../domains/Message";
import { Moment } from "../../helper/configs/moment";
import { IMessagePresenter } from "../../presenter";
import MessageStorageRepository from "../../repository/Message/messageStorageRepository";
import IndexedDB from "../../storage/indexedDB";
import DeleteMessageUseCase from "./deleteMessageUseCase";
import SendMessageUseCase from "./sendMessageUseCase";
import { v4 as uuidv4 } from "uuid";

export default class RetryMessageUseCase {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    try {
      const deleteMessageUseCase = new DeleteMessageUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      deleteMessageUseCase.execute(messageModel);

      const sendMessageUseCase = new SendMessageUseCase(this.presenter);

      const newMessageModel = new MessageModel(
        messageModel.getFromId(),
        messageModel.getToId(),
        messageModel.getConversationId(),
        messageModel.getType(),
        messageModel.getContent(),
        uuidv4(),
        Moment().toISOString(),
        MessageStatus.PENDING
      );

      sendMessageUseCase.execute(newMessageModel);
    } catch (e) {
      console.log(e);
    }
  }
}
