import ConversationDatabaseDataSource from "../../dataSource/Conversation/conversationDatabaseDataSouce";
import FriendDataSource from "../../dataSource/Friend/friendDataSouce";
import MessageStorageDataSource from "../../dataSource/Message/messageStorageDataSource";
import MessageSocketDataSource from "../../dataSource/Message/messageSocketDataSource";
import UserAPIDataSource from "../../dataSource/User/userDataSouce";
import { ConversationModel } from "../../domains/Conversation";
import { MessageModel } from "../../domains/Message";
import API from "../../network/api/API";
import Socket from "../../network/socket/socket";
import { ConversationPresenter, IMessagePresenter } from "../../presenter";
import ConversationStorageRepository from "../../repository/Conversation/conversationStorageRepository";
import FriendStorageRepository from "../../repository/Friend/friendStorageRepository";
import MessageDatabaseRepository from "../../repository/Message/messageDatabaseRepository";
import MessageSocketRepository from "../../repository/Message/messageSocketRepository";
import UserAPIRepository from "../../repository/User/userAPIRepository";
import IndexedDB from "../../storage/indexedDB";
import AddConversationUseCase from "../Conversation/addConversationUseCase";
import GetConversationByUserIdUseCase from "../Conversation/getConversationByUserIdUseCase";
import UpdateConversationUseCase from "../Conversation/updateConversationUseCase";
import AddFriendUseCase from "../Friend/addFriendUseCase";
import GetUseByIdUseCase from "../User/getUserByIdUseCase";
import AddMessageDatabaseUseCase from "./addMessageDatabaseUseCase";
import SendMessageSocketUseCase from "./sendMessageSocketUseCase";
import { v4 as uuidv4 } from "uuid";
import FriendPresenter from "../../presenter/Friend/friendPresenter";

export default class SendMessageUseCase {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    //Add to DB
    /* 
    if chatted (has conversation)
      updateConversation (lastMessage)
    else
      addConversation
      addFriend
    
    sendSocket
    
    */
    try {
      messageModel.setId(uuidv4());

      const getConversationByUserIdUseCase = new GetConversationByUserIdUseCase(
        new ConversationStorageRepository(
          new ConversationDatabaseDataSource(IndexedDB.getInstance())
        )
      );

      const conversationModel = await getConversationByUserIdUseCase.execute(
        messageModel.getToId()
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
      } else {
        //Get chatting user info

        const newConversationModel = new ConversationModel(
          messageModel.getToId(),
          messageModel
        );

        const addConversationUseCase = new AddConversationUseCase(
          new ConversationStorageRepository(
            new ConversationDatabaseDataSource(IndexedDB.getInstance())
          ),
          new ConversationPresenter()
        );

        messageModel.setConversationId(newConversationModel.getId());
        newConversationModel.setLastMessage(messageModel);

        addConversationUseCase.execute(newConversationModel);

        const getUserByIdUseCase = new GetUseByIdUseCase(
          new UserAPIRepository(new UserAPIDataSource(API.getIntance()))
        );

        const userModel = await getUserByIdUseCase.execute(
          messageModel.getToId()
        );

        const addFriendUseCase = new AddFriendUseCase(
          new FriendStorageRepository(
            new FriendDataSource(IndexedDB.getInstance())
          ),
          new FriendPresenter()
        );

        if (userModel) addFriendUseCase.execute(userModel);
      }

      const addMessageDatabaseUseCase = new AddMessageDatabaseUseCase(
        new MessageDatabaseRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        )
      );

      addMessageDatabaseUseCase.execute(messageModel);
    } catch (e) {
      console.log("Add message database error: ", e);
    }

    this.presenter.addMessage(messageModel);

    //Send socket
    try {
      const sendMessageSocketUseCase = new SendMessageSocketUseCase(
        new MessageSocketRepository(
          new MessageSocketDataSource(Socket.getIntance())
        )
      );

      sendMessageSocketUseCase.execute(messageModel);
    } catch (e) {
      console.log("Add message socket error: ", e);
    }
  }
}
