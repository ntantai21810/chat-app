import { MessageModel } from "../../domains";

export interface ISearchMessageRepo {
  searchMessage(text: string): Promise<MessageModel[]>;
}

export class SearchMessageUseCase {
  private repository: ISearchMessageRepo;

  constructor(repository: ISearchMessageRepo) {
    this.repository = repository;
  }

  async execute(text: string) {
    try {
      const res = await this.repository.searchMessage(text);

      return res;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
