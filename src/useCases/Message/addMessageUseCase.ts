import { MessageModel } from "../../domains/Message";
import { IMessagePresenter } from "../../presenter";

export interface IAddMessageRepo {
  addMessage(messageModel: MessageModel): void;
}

export default class AddMessageUseCase {
  private repository: IAddMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IAddMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(userId: string, messageModel: MessageModel) {
    try {
      this.repository.addMessage(messageModel);

      this.presenter.addMessage(userId, messageModel);
    } catch (e) {
      console.log({ e });
    }
  }
}
