import { IMessagePresenter } from "./../../presenter/Message/IMessagePresenter";
import { MessageModel } from "../../domains/Message";

export interface IDeleteMessageRepo {
  deleteMessage(messageModel: MessageModel): void;
}

export default class DeleteMessageUseCase {
  private repository: IDeleteMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IDeleteMessageRepo, presenter?: IMessagePresenter) {
    this.repository = repository;

    if (presenter) this.presenter = presenter;
  }

  execute(messageModel: MessageModel) {
    try {
      this.repository.deleteMessage(messageModel);

      if (this.presenter) this.presenter.deleteMessage(messageModel);
    } catch (e) {
      console.log(e);
    }
  }
}
