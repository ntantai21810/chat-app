import {
  ConversationDatabaseDataSource,
  FriendDataSource,
  MessageStorageDataSource,
  UserAPIDataSource,
} from "../../dataSource";
import { ConversationModel, MessageModel } from "../../domains";
import { API } from "../../network";
import {
  ConversationPresenter,
  FriendPresenter,
  IMessagePresenter,
} from "../../presenter";
import {
  ConversationStorageRepository,
  FriendStorageRepository,
  MessageStorageRepository,
  UserAPIRepository,
} from "../../repository";
import { IndexedDB } from "../../storage";
import {
  AddConversationUseCase,
  GetConversationByUserIdUseCase,
  UpdateConversationUseCase,
} from "../Conversation";
import { AddFriendUseCase } from "../Friend";
import { GetUserByIdUseCase } from "../User";
import { AddMessageDatabaseUseCase } from "./addMessageDatabaseUseCase";

export class ReceiveMessageUseCase {
  private presenter: IMessagePresenter;

  constructor(presenter?: IMessagePresenter) {
    if (presenter) {
      this.presenter = presenter;
    }
  }

  async execute(messageModel: MessageModel) {
    //Add to DB
    try {
      let conversationId = "";

      //Get active converstion info
      const getConversationUseCase = new GetConversationByUserIdUseCase(
        new ConversationStorageRepository(
          new ConversationDatabaseDataSource(IndexedDB.getInstance())
        )
      );

      const conversationModel = await getConversationUseCase.execute(
        messageModel.getFromId()
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

        conversationId = updatedConversationModel.getId();
        await updateConversationUseCase.execute(updatedConversationModel);
      } else {
        //Get chatting user info

        const newConversationModel = new ConversationModel(
          messageModel.getFromId(),
          messageModel
        );

        const addConversationUseCase = new AddConversationUseCase(
          new ConversationStorageRepository(
            new ConversationDatabaseDataSource(IndexedDB.getInstance())
          ),
          new ConversationPresenter()
        );

        conversationId = newConversationModel.getId();
        await addConversationUseCase.execute(newConversationModel);

        const getUserByIdUseCase = new GetUserByIdUseCase(
          new UserAPIRepository(new UserAPIDataSource(API.getIntance()))
        );

        const userModel = await getUserByIdUseCase.execute(
          messageModel.getFromId()
        );

        const addFriendUseCase = new AddFriendUseCase(
          new FriendStorageRepository(
            new FriendDataSource(IndexedDB.getInstance())
          ),
          new FriendPresenter()
        );

        if (userModel) await addFriendUseCase.execute(userModel);
      }

      messageModel.setConversationId(conversationId);

      if (this.presenter) {
        this.presenter.addMessage(messageModel);
      }

      const addMessageDatabaseUseCase = new AddMessageDatabaseUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        )
      );

      await addMessageDatabaseUseCase.execute(messageModel);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
