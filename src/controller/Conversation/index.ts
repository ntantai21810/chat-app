import { ConversationDatabaseDataSource } from "../../dataSource";
import { IConversationPresenter } from "../../presenter";
import { ConversationStorageRepository } from "../../repository";
import { IndexedDB } from "../../storage";
import { GetAllConversationUseCase } from "../../useCases";

export class ConversationController {
  private presenter: IConversationPresenter;

  constructor(presenter: IConversationPresenter) {
    this.presenter = presenter;
  }

  getAllConversations() {
    try {
      const getConversationUseCase = new GetAllConversationUseCase(
        new ConversationStorageRepository(
          new ConversationDatabaseDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      getConversationUseCase.execute();
    } catch (e) {
      console.log(e);
    }
  }
}
