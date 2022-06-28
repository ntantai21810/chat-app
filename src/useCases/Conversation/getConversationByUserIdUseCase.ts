import { ConversationModel } from "../../domains/Conversation";

export interface IGetConversationByUserIdRepo {
  getConversationByUserId(userId: string): Promise<ConversationModel | null>;
}

export default class GetConversationByUserIdUseCase {
  private repository: IGetConversationByUserIdRepo;

  constructor(repository: IGetConversationByUserIdRepo) {
    this.repository = repository;
  }

  async execute(userId: string) {
    const res = await this.repository.getConversationByUserId(userId);

    return res;
  }
}
