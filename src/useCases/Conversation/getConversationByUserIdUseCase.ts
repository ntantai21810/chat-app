import { ConversationModel } from "../../domains";

export interface IGetConversationByUserIdRepo {
  getConversationByUserId(userId: string): Promise<ConversationModel | null>;
}

export class GetConversationByUserIdUseCase {
  private repository: IGetConversationByUserIdRepo;

  constructor(repository: IGetConversationByUserIdRepo) {
    this.repository = repository;
  }

  async execute(userId: string) {
    try {
      const res = await this.repository.getConversationByUserId(userId);

      return res;
    } catch (e) {
      throw e;
    }
  }
}
