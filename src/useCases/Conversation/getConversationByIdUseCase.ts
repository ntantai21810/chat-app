import { ConversationModel } from "../../domains/Conversation";

export interface IGetConversationByIdRepo {
  getConversationById(userId: string): Promise<ConversationModel | null>;
}

export default class GetConversationByIdUseCase {
  private repository: IGetConversationByIdRepo;

  constructor(repository: IGetConversationByIdRepo) {
    this.repository = repository;
  }

  async execute(id: string) {
    try {
      const res = await this.repository.getConversationById(id);

      return res;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
