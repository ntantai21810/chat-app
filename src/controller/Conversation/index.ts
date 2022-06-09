import { ConversationRepository } from "../../repository";
import IndexedDB from "../../storage/indexedDB";
import ConversationUseCase from "../../useCases/Conversation/conversationUseCase";
import { IConversationPresenter } from "./../../presenter/Conversation/IConversationPresenter";

export default class ConversationController {
  private presenter: IConversationPresenter;

  constructor(presenter: IConversationPresenter) {
    this.presenter = presenter;
  }

  connectDB() {
    const conversationUseCase = new ConversationUseCase(
      new ConversationRepository(IndexedDB.getInstance()),
      this.presenter
    );

    conversationUseCase.connect();
  }

  getConversations() {
    const conversationUseCase = new ConversationUseCase(
      new ConversationRepository(IndexedDB.getInstance()),
      this.presenter
    );

    conversationUseCase.getConversation();
  }
}
