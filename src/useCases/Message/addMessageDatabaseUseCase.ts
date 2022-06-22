import { MessageModel } from "../../domains/Message";

export interface IAddMessageRepo {
  addMessage(messageModel: MessageModel): void;
}

export default class AddMessageDatabaseUseCase {
  private repository: IAddMessageRepo;

  constructor(repository: IAddMessageRepo) {
    this.repository = repository;
  }

  async execute(messageModel: MessageModel) {
    try {
      this.repository.addMessage(messageModel);
    } catch (e) {
      console.log(e);
    }
  }
}
