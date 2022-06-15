import { SOCKET_CONSTANTS } from "../../helper/constants";
import { IMessagePresenter } from "../../presenter";

export interface IListenTypingRepo {
  listenTyping(
    channel: string,
    callback: (fromUserId: string, isTyping: boolean) => void
  ): void;
}

export default class ListenTypingUseCase {
  private repository: IListenTypingRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IListenTypingRepo, presenter: IMessagePresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  async execute(userId: string) {
    this.repository.listenTyping(
      SOCKET_CONSTANTS.TYPING,
      (fromUserId: string, isTyping) => {
        if (userId === fromUserId) this.presenter.setTyping(isTyping);
      }
    );
  }
}
