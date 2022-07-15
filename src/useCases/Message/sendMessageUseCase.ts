import {
  ConversationDatabaseDataSource,
  FriendDataSource,
  MessageSocketDataSource,
  MessageStorageDataSource,
  UserAPIDataSource,
} from "../../dataSource";
import { ConversationModel, MessageModel } from "../../domains";
import { API, Socket } from "../../network";
import {
  ConversationPresenter,
  FriendPresenter,
  IMessagePresenter,
} from "../../presenter";
import {
  ConversationStorageRepository,
  FriendStorageRepository,
  MessageSocketRepository,
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
import { SendMessageSocketUseCase } from "./sendMessageSocketUseCase";

export class SendMessageUseCase {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    /* 
    --- Add to DB
      if chatted (has conversation)
        updateConversation (lastMessage)
      else
        addConversation
        addFriend
    
    --- sendSocket
    */

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

        await updateConversationUseCase.execute(updatedConversationModel);
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

        await addConversationUseCase.execute(newConversationModel);

        const getUserByIdUseCase = new GetUserByIdUseCase(
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

        if (userModel) await addFriendUseCase.execute(userModel);
      }

      const addMessageDatabaseUseCase = new AddMessageDatabaseUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        )
      );

      await addMessageDatabaseUseCase.execute(messageModel);
    } catch (e) {
      console.log("Add message database error: ", e);
      throw e;
    }

    this.presenter.addMessage(messageModel);

    //Send socket
    try {
      const sendMessageSocketUseCase = new SendMessageSocketUseCase(
        new MessageSocketRepository(
          new MessageSocketDataSource(Socket.getIntance())
        ),
        this.presenter
      );

      sendMessageSocketUseCase.execute(messageModel);
    } catch (e) {
      throw e;
    }
  }
}
