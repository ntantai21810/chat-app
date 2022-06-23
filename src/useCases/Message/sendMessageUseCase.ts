import ConversationDatabaseDataSource from "../../dataSource/Conversation/conversationDatabaseDataSouce";
import FileDataSource from "../../dataSource/File/fileDataSouce";
import FriendDataSource from "../../dataSource/Friend/friendDataSouce";
import MessageSocketDataSource from "../../dataSource/Message/messageSocketDataSource";
import MessageStorageDataSource from "../../dataSource/Message/messageStorageDataSource";
import UserAPIDataSource from "../../dataSource/User/userDataSouce";
import { ConversationModel } from "../../domains/Conversation";
import { MessageModel, MessageType } from "../../domains/Message";
import API from "../../network/api/API";
import Socket from "../../network/socket/socket";
import { ConversationPresenter, IMessagePresenter } from "../../presenter";
import FriendPresenter from "../../presenter/Friend/friendPresenter";
import ConversationStorageRepository from "../../repository/Conversation/conversationStorageRepository";
import FileRepository from "../../repository/File/fileRepository";
import FriendStorageRepository from "../../repository/Friend/friendStorageRepository";
import MessageDatabaseRepository from "../../repository/Message/messageDatabaseRepository";
import MessageSocketRepository from "../../repository/Message/messageSocketRepository";
import UserAPIRepository from "../../repository/User/userAPIRepository";
import IndexedDB from "../../storage/indexedDB";
import AddConversationUseCase from "../Conversation/addConversationUseCase";
import GetConversationByUserIdUseCase from "../Conversation/getConversationByUserIdUseCase";
import UpdateConversationUseCase from "../Conversation/updateConversationUseCase";
import UploadImageUseCase from "../File/uploadImageUseCase";
import AddFriendUseCase from "../Friend/addFriendUseCase";
import GetUseByIdUseCase from "../User/getUserByIdUseCase";
import AddMessageDatabaseUseCase from "./addMessageDatabaseUseCase";
import SendMessageSocketUseCase from "./sendMessageSocketUseCase";

export default class SendMessageUseCase {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    /* 
    --- Upload file if have

    --- Add to DB
      if chatted (has conversation)
        updateConversation (lastMessage)
      else
        addConversation
        addFriend
    
    --- sendSocket
    */

    try {
      if (messageModel.getType() === MessageType.IMAGE) {
        const uploadImagesUseCase = new UploadImageUseCase(
          new FileRepository(new FileDataSource(API.getIntance()))
        );

        const imageUrls = await uploadImagesUseCase.execute(
          messageModel.getContent().split("-")
        );

        messageModel.setContent(imageUrls.join("-"));
      }
    } catch (e) {
      console.log("Upload error: ", e);
      return;
    }

    try {
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
      return;
    }

    this.presenter.addMessage(messageModel);

    //Send socket
    const sendMessageSocketUseCase = new SendMessageSocketUseCase(
      new MessageSocketRepository(
        new MessageSocketDataSource(Socket.getIntance())
      ),
      this.presenter
    );

    sendMessageSocketUseCase.execute(messageModel);
  }
}
