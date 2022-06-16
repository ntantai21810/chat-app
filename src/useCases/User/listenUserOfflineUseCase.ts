import { ConversationIndexedDataSource } from "../../dataSource";
import { UserModel } from "../../domains/User";
import { SOCKET_CONSTANTS } from "../../helper/constants";
import { ConversationPresenter, IUserPresenter } from "../../presenter";
import ConversationRepository from "../../repository/Conversation/conversationRepository";
import IndexedDB from "../../storage/indexedDB";
import GetConversationUseCase from "../Conversation/getConversationUseCase";
import UpdateConversationUseCase from "../Conversation/updateConversationUseCase";

export interface IListenUserOfflineRepo {
  listenUserOffline(channel: string, callback: (user: UserModel) => void): void;
}

export default class ListenUserOfflineUseCase {
  private repository: IListenUserOfflineRepo;
  private presenter: IUserPresenter;

  constructor(repository: IListenUserOfflineRepo, presenter: IUserPresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute() {
    const updateConverstionUseCase = new UpdateConversationUseCase(
      new ConversationRepository(
        new ConversationIndexedDataSource(IndexedDB.getInstance())
      ),
      new ConversationPresenter()
    );

    const getConversationUseCase = new GetConversationUseCase(
      new ConversationRepository(
        new ConversationIndexedDataSource(IndexedDB.getInstance())
      )
    );

    this.repository.listenUserOffline(
      SOCKET_CONSTANTS.USER_DISCONNECT,
      async (userModel) => {
        const conversationModel = await getConversationUseCase.execute(
          userModel.getId()
        );

        if (conversationModel) {
          conversationModel.setUser(userModel);

          updateConverstionUseCase.execute(conversationModel);
        }

        this.presenter.removeUserOnline(userModel);
      }
    );
  }
}
