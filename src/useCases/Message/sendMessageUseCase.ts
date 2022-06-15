import { ConversationIndexedDataSource } from "../../dataSource";
import ConversationDBDataSource from "../../dataSource/Conversation/conversationStorageDataSouce";
import UserAPIDataSource from "../../dataSource/User/userAPIDataSouce";
import { ConversationModel } from "../../domains/Conversation";
import { MessageModel } from "../../domains/Message";
import { Moment } from "../../helper/configs/moment";
import { API } from "../../network";
import { ConversationPresenter, IMessagePresenter } from "../../presenter";
import ConversationRepository from "../../repository/Conversation/conversationRepository";
import UserRepository from "../../repository/User/userRepository";
import IndexedDB from "../../storage/indexedDB";
import AddConversationUseCase from "../Conversation/addConversationUseCase";
import GetConversationUseCase from "../Conversation/getConversationUseCase";
import UpdateConversationUseCase from "../Conversation/updateConversationUseCase";
import GetUserUseCase from "../User/getUserUseCase";

export interface ISendMessageRepo {
  sendMessage(messageModel: MessageModel): void;
}

export default class SendMessageUseCase {
  private repository: ISendMessageRepo;
  private presenter: IMessagePresenter;

  constructor(repository: ISendMessageRepo, presenter: IMessagePresenter) {
    this.repository = repository;

    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    /*
      - Send message socket
      - Update message redux
      - if chatted (has conversation)
            - update last message
        else 
            - create conversation
    
    */
    try {
      this.repository.sendMessage(messageModel);

      this.presenter.addMessage(messageModel.getToId(), messageModel);

      //Get active converstion info
      const getConversationUseCase = new GetConversationUseCase(
        new ConversationRepository(
          new ConversationDBDataSource(IndexedDB.getInstance())
        )
      );

      const conversationModel = await getConversationUseCase.execute(
        messageModel.getToId()
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

        const userModel = await getUserUseCase.execute(messageModel.getToId());

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
}
