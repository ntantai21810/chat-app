import { MessageModel } from "../../domains";

export interface IGetPendingMessageRepo {
  getPendingMessages(): Promise<MessageModel[]>;
}

export class GetPendingMessageUseCase {
  private repository: IGetPendingMessageRepo;

  constructor(repository: IGetPendingMessageRepo) {
    this.repository = repository;
  }

  async execute() {
    try {
      const res = await this.repository.getPendingMessages();

      return res;
    } catch (e) {
      throw e;
    }
  }
}
