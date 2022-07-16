import { MessageStorageDataSource } from "../../dataSource";
import { MessageModel, MessageStatus } from "../../domains";
import { IMessagePresenter } from "../../presenter";
import { MessageStorageRepository } from "../../repository";
import { IndexedDB } from "../../storage";
import { UpdateMessageUseCase } from "./updateMessageUseCase";

export interface ISendMessageRepo {
  sendMessage(messageModel: MessageModel): Promise<void>;
}

export class SendMessageSocketUseCase {
  private repository: ISendMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: ISendMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    try {
      await this.repository.sendMessage(messageModel);
    } catch (e) {
      const updateMessageUseCase = new UpdateMessageUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      messageModel.setStatus(MessageStatus.ERROR);

      updateMessageUseCase.execute(messageModel);

      throw e;
    }
  }
}
