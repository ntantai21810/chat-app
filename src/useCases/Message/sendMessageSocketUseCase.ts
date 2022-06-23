import MessageStorageDataSource from "../../dataSource/Message/messageStorageDataSource";
import { MessageModel, MessageStatus } from "../../domains/Message";
import { IMessagePresenter } from "../../presenter";
import MessageDatabaseRepository from "../../repository/Message/messageDatabaseRepository";
import IndexedDB from "../../storage/indexedDB";
import UpdateMessageUseCase from "./updateMessageUseCase";

export interface ISendMessageRepo {
  sendMessage(messageModel: MessageModel): void;
}

export default class SendMessageSocketUseCase {
  private repository: ISendMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: ISendMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    try {
      this.repository.sendMessage(messageModel);
    } catch (e) {
      const updateMessageUseCase = new UpdateMessageUseCase(
        new MessageDatabaseRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      messageModel.setStatus(MessageStatus.ERROR);

      updateMessageUseCase.execute(messageModel);
    }
  }
}
