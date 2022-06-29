import { ConversationDatabaseDataSource } from "../../dataSource";
import { ConversationModel, MessageModel } from "../../domains";
import { ConversationPresenter, IMessagePresenter } from "../../presenter";
import { ConversationStorageRepository } from "../../repository";
import { IndexedDB } from "../../storage";
import {
  GetConversationByIdUseCase,
  UpdateConversationUseCase,
} from "../Conversation";

export interface IUpdateMessageRepo {
  updateMessage(messageModel: MessageModel): void;
}

export class UpdateMessageUseCase {
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
      throw e;
    }
  }
}
