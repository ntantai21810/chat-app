import { MessageModel } from "../../domains/Message";
import { IMessagePresenter } from "../../presenter";

export interface IGetMessageRepo {
  getMessages(myId: string, otherId: string): Promise<MessageModel[]>;
}

export default class GetMessageUseCase {
  private repository: IGetMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IGetMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(myId: string, otherId: string) {
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
