import { IMessage, MessageModel, normalizeMessageData } from "../../domains";
import { IAckMessageRepo, ISendMessageRepo } from "../../useCases";

export interface IMessageSocketDataSouce {
  sendMessage(message: IMessage): void;
  ackMessage(message: IMessage): void;
}

export class MessageSocketRepository
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
