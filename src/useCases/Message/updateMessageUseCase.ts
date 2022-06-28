import ConversationDatabaseDataSource from "../../dataSource/Conversation/conversationDatabaseDataSouce";
import { ConversationModel } from "../../domains/Conversation";
import { MessageModel } from "../../domains/Message";
import { ConversationPresenter, IMessagePresenter } from "../../presenter";
import ConversationStorageRepository from "../../repository/Conversation/conversationStorageRepository";
import IndexedDB from "../../storage/indexedDB";
import GetConversationByIdUseCase from "../Conversation/getConversationByIdUseCase";
import UpdateConversationUseCase from "../Conversation/updateConversationUseCase";

export interface IUpdateMessageRepo {
  updateMessage(messageModel: MessageModel): void;
}

export default class UpdateMessageUseCase {
  private repository: IUpdateMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IUpdateMessageRepo, presenter?: IMessagePresenter) {
    this.repository = repository;

    if (presenter) this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    try {
      this.repository.updateMessage(messageModel);

      if (this.presenter) this.presenter.updateMessage(messageModel);

      const getConversationByUserIdUseCase = new GetConversationByIdUseCase(
        new ConversationStorageRepository(
          new ConversationDatabaseDataSource(IndexedDB.getInstance())
        )
      );

      const conversationModel = await getConversationByUserIdUseCase.execute(
        messageModel.getConversationId()
      );

      if (conversationModel) {
        const updatedConversationModel = new ConversationModel(
          conversationModel.getUserId(),
          messageModel
        );

        updatedConversationModel.setId(conversationModel.getId());

        const updateConversationUseCase = new UpdateConversationUseCase(
          new ConversationStorageRepository(
            new ConversationDatabaseDataSource(IndexedDB.getInstance())
          ),
          new ConversationPresenter()
        );

        messageModel.setConversationId(updatedConversationModel.getId());
        updatedConversationModel.setLastMessage(messageModel);

        updateConversationUseCase.execute(updatedConversationModel);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
