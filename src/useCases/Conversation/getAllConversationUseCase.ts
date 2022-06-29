import { ConversationModel } from "../../domains";
import { IConversationPresenter } from "../../presenter";

export interface IGetAllConversationRepo {
  getAllConversations(): Promise<ConversationModel[]>;
}

export class GetAllConversationUseCase {
  private repository: IGetAllConversationRepo;
  private presenter: IConversationPresenter;

  constructor(
    repository: IGetAllConversationRepo,
    presenter: IConversationPresenter
  ) {
    this.repository = repository;
    this.presenter = presenter;
  }

  async execute() {
    try {
      const res = await this.repository.getAllConversations();

      this.presenter.setConversations(res);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
