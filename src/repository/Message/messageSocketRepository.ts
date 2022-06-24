import { IMessage, MessageModel } from "../../domains/Message";
import { normalizeMessageData } from "../../domains/Message/helper";
import { IAckMessageRepo } from "../../useCases/Message/ackMessageUseCase";
import { ISendMessageRepo } from "../../useCases/Message/sendMessageSocketUseCase";

export interface IMessageSocketDataSouce {
  sendMessage(message: IMessage): void;
  ackMessage(message: IMessage): void;
}

export default class MessageSocketRepository
  implements ISendMessageRepo, IAckMessageRepo
{
  private dataSource: IMessageSocketDataSouce;

  constructor(dataSource: IMessageSocketDataSouce) {
    this.dataSource = dataSource;
  }

  sendMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dataSource.sendMessage(message);
  }

  ackMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dataSource.ackMessage(message);
  }
}
