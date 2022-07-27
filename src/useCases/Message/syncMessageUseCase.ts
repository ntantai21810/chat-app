import {
  MessageAPIDataSource,
  MessageSocketDataSource,
  MessageStorageDataSource,
} from "../../dataSource";
import { MessageStatus } from "../../domains";
import { API, Socket } from "../../network";
import { IMessagePresenter } from "../../presenter";
import {
  MessageAPIRepository,
  MessageSocketRepository,
  MessageStorageRepository,
} from "../../repository";
import { IndexedDB } from "../../storage";
import { AckMessageUseCase } from "./ackMessageUseCase";
import { DeleteMessageUseCase } from "./deleteMessageUseCase";
import { DeletePendingMessageUseCase } from "./deletePendingMessageUseCase";
import { GetPendingMessageUseCase } from "./getPendingMessageUseCase";
import { ReceiveMessageUseCase } from "./receiveMessageUseCase";
import { UpdateMessageUseCase } from "./updateMessageUseCase";

export class SyncMessageUseCase {
  private presenter: IMessagePresenter;

  constructor(presenter?: IMessagePresenter) {
    if (presenter) this.presenter = presenter;
  }

  async execute(activeUserId: string) {
    try {
      const getPendingMessageUseCase = new GetPendingMessageUseCase(
        new MessageAPIRepository(new MessageAPIDataSource(API.getIntance()))
      );

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
        const receiveMessageUseCase = new ReceiveMessageUseCase(
          activeUserId === messageModel.getFromId() ? this.presenter : undefined
        );

        try {
          if (messageModel.getStatus() === MessageStatus.SENT) {
            messageModel.setStatus(MessageStatus.RECEIVED);

            await receiveMessageUseCase.execute(messageModel);

            try {
              await ackMessageUseCase.execute(messageModel);
            } catch (e) {
              deleteMessageUseCase.execute(messageModel);
              continue;
            }
          } else {
            await updateMessageUseCase.execute(messageModel);
          }

          doneMessageIds.push(messageModel.getId());
        } catch (e) {}
      }

      //Delete message
      if (doneMessageIds.length > 0) {
        const deletePendingMessageUseCase = new DeletePendingMessageUseCase(
          new MessageAPIRepository(new MessageAPIDataSource(API.getIntance()))
        );

        await deletePendingMessageUseCase.execute(doneMessageIds);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
