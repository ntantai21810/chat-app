import { MessageModel } from "../../domains/Message";

export interface IAckMessageRepo {
  ackMessage(messageModel: MessageModel): void;
}

export default class AckMessageUseCase {
  private repository: IAckMessageRepo;

  constructor(repository: IAckMessageRepo) {
    this.repository = repository;
  }

  async execute(messageModel: MessageModel) {
    try {
      this.repository.ackMessage(messageModel);
    } catch (e) {
      console.log(e);
    }
  }
}
