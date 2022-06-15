import { MessageModel } from "../../domains/Message";
import { Moment } from "../../helper/configs/moment";
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

      res.sort(
        (m1, m2) =>
          Moment(m1.getSendTime()).unix() - Moment(m2.getSendTime()).unix()
      );

      this.presenter.setMessages(otherId, res);
    } catch (e) {
      console.log(e);
    }

    this.presenter.setLoading(false);
  }
}
