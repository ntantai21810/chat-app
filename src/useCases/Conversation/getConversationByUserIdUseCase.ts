import { ConversationModel } from "../../domains/Conversation";

export interface IGetConversationRepo {
  getConversationByUserId(userId: string): Promise<ConversationModel | null>;
}

export default class GetConversationByUserIdUseCase {
  private repository: IGetConversationRepo;

  constructor(repository: IGetConversationRepo) {
    this.repository = repository;
  }

  async execute(userId: string) {
    const res = await this.repository.getConversationByUserId(userId);

    return res;
  }
}
