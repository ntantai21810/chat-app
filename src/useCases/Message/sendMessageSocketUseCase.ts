import { MessageModel } from "../../domains/Message";

export interface ISendMessageRepo {
  sendMessage(messageModel: MessageModel): void;
}

export default class SendMessageSocketUseCase {
  private repository: ISendMessageRepo;

  constructor(repository: ISendMessageRepo) {
    this.repository = repository;
  }

  async execute(messageModel: MessageModel) {
    try {
      this.repository.sendMessage(messageModel);
    } catch (e) {
      console.log(e);
    }
  }
}
