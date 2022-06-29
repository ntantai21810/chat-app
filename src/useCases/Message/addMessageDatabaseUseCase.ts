import { MessageModel } from "../../domains";

export interface IAddMessageRepo {
  addMessage(messageModel: MessageModel): void;
}

export class AddMessageDatabaseUseCase {
  private repository: IAddMessageRepo;

  constructor(repository: IAddMessageRepo) {
    this.repository = repository;
  }

  async execute(messageModel: MessageModel) {
    try {
      this.repository.addMessage(messageModel);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
