import { MessageModel } from "../../domains";
import { IMessagePresenter } from "../../presenter";

export interface IDeleteMessageRepo {
  deleteMessage(messageModel: MessageModel): void;
}

export class DeleteMessageUseCase {
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
      throw e;
    }
  }
}
