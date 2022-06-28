import { MessageModel } from "../../domains/Message";

export interface IGetPendingMessageRepo {
  getPendingMessages(): Promise<MessageModel[]>;
}

export default class GetPendingMessageUseCase {
  private repository: IGetPendingMessageRepo;

  constructor(repository: IGetPendingMessageRepo) {
    this.repository = repository;
  }

  async execute() {
    try {
      const res = await this.repository.getPendingMessages();

      return res;
    } catch (e) {
      return [];
    }
  }
}
