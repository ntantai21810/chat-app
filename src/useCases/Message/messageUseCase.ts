import { IMessagePresenter } from "../../presenter";
import { IMessageRepository } from "../../repository";
import { IMessageUseCase } from "./IMessageUseCase";

export default class MessageUseCase implements IMessageUseCase {
  private repository: IMessageRepository;
  private presenter: IMessagePresenter;

  constructor(repository: IMessageRepository, presenter?: IMessagePresenter) {
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

  async getMessages(myId: string, otherId: string) {
    this.presenter.setLoading(true);

    try {
      const res = await this.repository.getMessages(myId, otherId);

      this.presenter.setMessages(otherId, res);
    } catch (e) {
      console.log(e);
    }

    this.presenter.setLoading(false);
  }
}
