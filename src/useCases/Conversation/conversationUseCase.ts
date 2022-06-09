import { IConversationPresenter } from "../../presenter";
import { IConversationRepository } from "../../repository";
import { IConversationUseCase } from "./IConversationUseCase";

export default class ConversationUseCase implements IConversationUseCase {
  private repository: IConversationRepository;
  private presenter: IConversationPresenter;

  constructor(
    repository: IConversationRepository,
    presenter?: IConversationPresenter
  ) {
    this.repository = repository;

    if (presenter) this.presenter = presenter;
  }

  async connect() {
    try {
      await this.repository.connect();

      this.presenter.setDBLoaded(true);
    } catch (e) {
      console.log(e);
    }
  }

  async getConversation() {
    this.presenter.setLoading(true);

    try {
      const res = await this.repository.getConversations();

      this.presenter.setConversations(res);
    } catch (e) {
      console.log(e);
    }

    this.presenter.setLoading(false);
  }
}
