import { v4 as uuidv4 } from "uuid";
import {
  ConversationDatabaseDataSource,
  MessageSocketDataSource,
  MessageStorageDataSource,
} from "../../dataSource";
import { ConversationModel, MessageModel, MessageStatus } from "../../domains";
import { Socket } from "../../network";
import { ConversationPresenter, IMessagePresenter } from "../../presenter";
import {
  ConversationStorageRepository,
  MessageSocketRepository,
  MessageStorageRepository,
} from "../../repository";
import { IndexedDB } from "../../storage";
import {
  AddConversationUseCase,
  GetConversationByUserIdUseCase,
  UpdateConversationUseCase,
} from "../Conversation";
import { DeleteMessageUseCase } from "./deleteMessageUseCase";
import { SendMessageSocketUseCase } from "./sendMessageSocketUseCase";

export class RetryMessageUseCase {
  private presenter: IMessagePresenter;

  constructor(presenter: IMessagePresenter) {
    this.presenter = presenter;
  }

  async execute(messageModel: MessageModel) {
    try {
      const sendMessageSocketUseCase = new SendMessageSocketUseCase(
        new MessageSocketRepository(
          new MessageSocketDataSource(Socket.getIntance())
        )
      );

      const newMessageModel = new MessageModel(
        messageModel.getFromId(),
        messageModel.getToId(),
        messageModel.getConversationId(),
        messageModel.getType(),
        messageModel.getContent(),
        uuidv4(),
        new Date().toISOString(),
        MessageStatus.PENDING
      );

      await sendMessageSocketUseCase.execute(newMessageModel, false);

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
      }

      const deleteMessageUseCase = new DeleteMessageUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        ),
        this.presenter
      );

      await deleteMessageUseCase.execute(messageModel);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
