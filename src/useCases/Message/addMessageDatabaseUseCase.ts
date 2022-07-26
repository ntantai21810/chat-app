import { MessageModel } from "../../domains";

export interface IAddMessageRepo {
  addMessage(messageModel: MessageModel): Promise<void>;
}

export class AddMessageDatabaseUseCase {
  private repository: IAddMessageRepo;

  constructor(repository: IAddMessageRepo) {
    this.repository = repository;
  }

  async execute(messageModel: MessageModel) {
    try {
      await this.repository.addMessage(messageModel);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
