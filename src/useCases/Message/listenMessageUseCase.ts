import { MessageModel } from "../../domains/Message";
import { SOCKET_CONSTANTS } from "../../helper/constants";
import { IMessagePresenter } from "../../presenter";

export interface IListenMessageRepo {
  listenMessage(
    channel: string,
    callback: (messageModel: MessageModel) => void
  ): void;
}

export default class ListenMessageUseCase {
  private repository: IListenMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IListenMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute() {
    this.repository.listenMessage(
      SOCKET_CONSTANTS.CHAT_MESSAGE,
      (messageModel: MessageModel) => {
        this.presenter.addMessage(messageModel.getFromId(), messageModel);
      }
    );
  }
}
