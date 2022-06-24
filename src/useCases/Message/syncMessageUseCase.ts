import MessageAPIDataSource from "../../dataSource/Message/messageAPIDataSource";
import MessageSocketDataSource from "../../dataSource/Message/messageSocketDataSource";
import MessageStorageDataSource from "../../dataSource/Message/messageStorageDataSource";
import { MessageStatus } from "../../domains/Message";
import API from "../../network/api/API";
import Socket from "../../network/socket/socket";
import MessageAPIRepository from "../../repository/Message/messageAPIRepository";
import MessageSocketRepository from "../../repository/Message/messageSocketRepository";
import MessageStorageRepository from "../../repository/Message/messageStorageRepository";
import IndexedDB from "../../storage/indexedDB";
import AckMessageUseCase from "./ackMessageUseCase";
import DeleteMessageUseCase from "./deleteMessageUseCase";
import DeletePendingMessageUseCase from "./deletePendingMessageUseCase";
import GetPendingMessageUseCase from "./getPendingMessageUseCase";
import ReceiveMessageUseCase from "./receiveMessageUseCase";
import UpdateMessageUseCase from "./updateMessageUseCase";

export default class SyncMessageUseCase {
  async execute() {
    try {
      const getPendingMessageUseCase = new GetPendingMessageUseCase(
        new MessageAPIRepository(new MessageAPIDataSource(API.getIntance()))
      );

      const receiveMessageUseCase = new ReceiveMessageUseCase();
      const updateMessageUseCase = new UpdateMessageUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        )
      );
      const ackMessageUseCase = new AckMessageUseCase(
        new MessageSocketRepository(
          new MessageSocketDataSource(Socket.getIntance())
        )
      );
      const deleteMessageUseCase = new DeleteMessageUseCase(
        new MessageStorageRepository(
          new MessageStorageDataSource(IndexedDB.getInstance())
        )
      );

      const messageModels = await getPendingMessageUseCase.execute();

      const doneMessageIds: string[] = [];

      for (let messageModel of messageModels) {
        try {
          if (messageModel.getStatus() === MessageStatus.SENT) {
            messageModel.setStatus(MessageStatus.RECEIVED);

            receiveMessageUseCase.execute(messageModel);

            try {
              ackMessageUseCase.execute(messageModel);
            } catch (e) {
              deleteMessageUseCase.execute(messageModel);
              continue;
            }
          } else {
            updateMessageUseCase.execute(messageModel);
          }

          doneMessageIds.push(messageModel.getId());
        } catch (e) {}
      }

      //Delete message
      if (doneMessageIds.length > 0) {
        const deletePendingMessageUseCase = new DeletePendingMessageUseCase(
          new MessageAPIRepository(new MessageAPIDataSource(API.getIntance()))
        );

        deletePendingMessageUseCase.execute(doneMessageIds);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
