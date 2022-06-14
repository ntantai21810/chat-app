//Data source
import { ConversationIndexedDataSource } from "../../dataSource";

//Repo
import ConversationRepository from "../../repository/Conversation/conversationRepository";

//DB
import IndexedDB from "../../storage/indexedDB";

//Use case
import ConnectDBConversationUseCase from "../../useCases/Conversation/connectDBUseCase";
import GetAllConversationUseCase from "../../useCases/Conversation/getAllConversationUseCase";

//Presenter
import { IConversationPresenter } from "./../../presenter/Conversation/IConversationPresenter";

export default class ConversationController {
  private presenter: IConversationPresenter;

  constructor(presenter: IConversationPresenter) {
    this.presenter = presenter;
  }

  connectDB(name: string, userId: string) {
    const connectDBConversationUseCase = new ConnectDBConversationUseCase(
      new ConversationRepository(
        new ConversationIndexedDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    connectDBConversationUseCase.execute(name, userId);
  }

  getConversations() {
    const getConversationUseCase = new GetAllConversationUseCase(
      new ConversationRepository(
        new ConversationIndexedDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    getConversationUseCase.execute();
  }
}
