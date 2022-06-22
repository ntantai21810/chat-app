//Data source

//Repo
import ConversationDatabaseDataSource from "../../dataSource/Conversation/conversationDatabaseDataSouce";
import ConversationStorageRepository from "../../repository/Conversation/conversationStorageRepository";

//DB
import IndexedDB from "../../storage/indexedDB";

//Use case
import GetAllConversationUseCase from "../../useCases/Conversation/getAllConversationUseCase";

//Presenter
import { IConversationPresenter } from "./../../presenter/Conversation/IConversationPresenter";

export default class ConversationController {
  private presenter: IConversationPresenter;

  constructor(presenter: IConversationPresenter) {
    this.presenter = presenter;
  }

  getAllConversations() {
    const getConversationUseCase = new GetAllConversationUseCase(
      new ConversationStorageRepository(
        new ConversationDatabaseDataSource(IndexedDB.getInstance())
      ),
      this.presenter
    );

    getConversationUseCase.execute();
  }
}
