import ConversationDatabaseDataSource from "../../dataSource/Conversation/conversationDatabaseDataSouce";
import FriendDataSource from "../../dataSource/Friend/friendDataSouce";
import MessageCacheDataSource from "../../dataSource/Message/messageCacheDataSource";
import MessageStorageDataSource from "../../dataSource/Message/messageStorageDataSource";
import UserAPIDataSource from "../../dataSource/User/userDataSouce";
import { ConversationModel } from "../../domains/Conversation";
import { MessageModel } from "../../domains/Message";
import API from "../../network/api/API";
import { ConversationPresenter, IMessagePresenter } from "../../presenter";
import FriendPresenter from "../../presenter/Friend/friendPresenter";
import ConversationStorageRepository from "../../repository/Conversation/conversationStorageRepository";
import FriendStorageRepository from "../../repository/Friend/friendStorageRepository";
import MessageDatabaseRepository from "../../repository/Message/messageDatabaseRepository";
import UserAPIRepository from "../../repository/User/userAPIRepository";
import Cache from "../../storage/cache";
import IndexedDB from "../../storage/indexedDB";
import AddConversationUseCase from "../Conversation/addConversationUseCase";
import GetConversationByUserIdUseCase from "../Conversation/getConversationByUserIdUseCase";
import UpdateConversationUseCase from "../Conversation/updateConversationUseCase";
import AddFriendUseCase from "../Friend/addFriendUseCase";
import GetUseByIdUseCase from "../User/getUserByIdUseCase";
import AddMessageDatabaseUseCase from "./addMessageDatabaseUseCase";

export default class ReceiveMessageUseCase {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel, addToCache: boolean) {
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
        updateConversationUseCase.execute(updatedConversationModel);
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
        addConversationUseCase.execute(newConversationModel);

        const getUserByIdUseCase = new GetUseByIdUseCase(
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

        if (userModel) addFriendUseCase.execute(userModel);
      }

      messageModel.setConversationId(conversationId);

      if (addToCache) {
        //Add to cache
        const addMessageDatabaseUseCase = new AddMessageDatabaseUseCase(
          new MessageDatabaseRepository(
            new MessageCacheDataSource(Cache.getInstance())
          )
        );

        addMessageDatabaseUseCase.execute(messageModel);
      } else {
        this.presenter.addMessage(messageModel);
      }

      const addMessageDatabaseUseCase = new AddMessageDatabaseUseCase(
        new MessageDatabaseRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        )
      );

      addMessageDatabaseUseCase.execute(messageModel);
    } catch (e) {
      console.log(e);
    }
  }
}
