import { IMessagePresenter } from "../../presenter";
import { MessageRepository } from "../../repository";
import IndexedDB from "../../storage/indexedDB";
import { MessageUseCase } from "../../useCases";

export default class MessageController {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  connectDB() {
    const messageUseCase = new MessageUseCase(
      new MessageRepository(IndexedDB.getInstance()),
      this.presenter
    );

    messageUseCase.connect();
  }

  getMessages(myId: string, otherId: string) {
    const messageUseCase = new MessageUseCase(
      new MessageRepository(IndexedDB.getInstance()),
      this.presenter
    );

    messageUseCase.getMessages(myId, otherId);
  }
}
