import { ConversationModel } from "../../domains";

export interface IGetConversationByIdRepo {
  getConversationById(userId: string): Promise<ConversationModel | null>;
}

export class GetConversationByIdUseCase {
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
      throw e;
    }
  }
}
