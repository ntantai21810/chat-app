import { MessageModel } from "../../domains";

export interface IAckMessageRepo {
  ackMessage(messageModel: MessageModel): void;
}

export class AckMessageUseCase {
  private repository: IAckMessageRepo;

  constructor(repository: IAckMessageRepo) {
    this.repository = repository;
  }

  async execute(messageModel: MessageModel) {
    try {
      this.repository.ackMessage(messageModel);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
