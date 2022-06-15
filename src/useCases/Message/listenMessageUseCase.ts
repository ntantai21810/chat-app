import {
  ConversationIndexedDataSource,
  MessageIndexedDataSource,
} from "../../dataSource";
import ConversationDBDataSource from "../../dataSource/Conversation/conversationStorageDataSouce";
import UserAPIDataSource from "../../dataSource/User/userAPIDataSouce";
import { ConversationModel } from "../../domains/Conversation";
import { MessageModel } from "../../domains/Message";
import { Moment } from "../../helper/configs/moment";
import { SOCKET_CONSTANTS } from "../../helper/constants";
import { API } from "../../network";
import { ConversationPresenter, IMessagePresenter } from "../../presenter";
import ConversationRepository from "../../repository/Conversation/conversationRepository";
import MessageRepository from "../../repository/Message/messageRepository";
import UserRepository from "../../repository/User/userRepository";
import IndexedDB from "../../storage/indexedDB";
import AddConversationUseCase from "../Conversation/addConversationUseCase";
import GetConversationUseCase from "../Conversation/getConversationUseCase";
import UpdateConversationUseCase from "../Conversation/updateConversationUseCase";
import GetUserUseCase from "../User/getUserUseCase";
import AddMessageUseCase from "./addMessageUseCase";

export interface IListenMessageRepo {
  listenMessage(
    channel: string,
    callback: (messageModel: MessageModel) => void
  ): void;
}

export default class ListenMessageUseCase {
  private repository: IListenMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: IListenMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  execute() {
    this.repository.listenMessage(
      SOCKET_CONSTANTS.CHAT_MESSAGE,
      async (messageModel: MessageModel) => {
        try {
          const addMessageUseCase = new AddMessageUseCase(
            new MessageRepository(
              new MessageIndexedDataSource(IndexedDB.getInstance())
            ),
            this.presenter
          );

          addMessageUseCase.execute(messageModel.getFromId(), messageModel);

          //Get active converstion info
          const getConversationUseCase = new GetConversationUseCase(
            new ConversationRepository(
              new ConversationDBDataSource(IndexedDB.getInstance())
            )
          );

          const conversationModel = await getConversationUseCase.execute(
            messageModel.getFromId()
          );

          if (conversationModel) {
            const updatedConversationModel = new ConversationModel(
              conversationModel.getUser(),
              messageModel,
              Moment().toString()
            );

            const updateConversationUseCase = new UpdateConversationUseCase(
              new ConversationRepository(
                new ConversationIndexedDataSource(IndexedDB.getInstance())
              ),
              new ConversationPresenter()
            );

            updateConversationUseCase.execute(updatedConversationModel);
          } else {
            //Get chatting user info
            const getUserUseCase = new GetUserUseCase(
              new UserRepository(new UserAPIDataSource(API.getIntance()))
            );

            const userModel = await getUserUseCase.execute(
              messageModel.getFromId()
            );

            if (userModel) {
              const newConversationModel = new ConversationModel(
                userModel,
                messageModel,
                Moment().toString()
              );

              const addConversationUseCase = new AddConversationUseCase(
                new ConversationRepository(
                  new ConversationDBDataSource(IndexedDB.getInstance())
                ),
                new ConversationPresenter()
              );

              addConversationUseCase.execute(newConversationModel);
            }
          }
        } catch (e) {
          console.log({ e });
        }
      }
    );
  }
}
