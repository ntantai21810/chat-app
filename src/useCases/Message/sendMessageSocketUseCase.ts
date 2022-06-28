import MessageStorageDataSource from "../../dataSource/Message/messageStorageDataSource";
import { MessageModel, MessageStatus } from "../../domains/Message";
import { IMessagePresenter } from "../../presenter";
import MessageStorageRepository from "../../repository/Message/messageStorageRepository";
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
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      messageModel.setStatus(MessageStatus.ERROR);

      updateMessageUseCase.execute(messageModel);
    }
  }
}
