import { MessageModel } from "../../domains/Message";

export interface IDeleteMessageRepo {
  deleteMessage(messageModel: MessageModel): void;
}

export default class DeleteMessageUseCase {
  private repository: IDeleteMessageRepo;

  constructor(repository: IDeleteMessageRepo) {
    this.repository = repository;
  }

  execute(messageModel: MessageModel) {
    try {
      this.repository.deleteMessage(messageModel);
    } catch (e) {
      console.log(e);
    }
  }
}
