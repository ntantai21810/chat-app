import { IMessage, MessageModel, modelMessageData } from "../../domains";
import {
  IDeletePendingMessageRepo,
  IGetPendingMessageRepo,
} from "../../useCases";

export interface IMessageAPIDataSouce {
  getPendingMessages(): Promise<IMessage[]>;
  deletePendingMessages(ids: string[]): Promise<void>;
}

export class MessageAPIRepository
  implements IGetPendingMessageRepo, IDeletePendingMessageRepo
{
  private dataSource: IMessageAPIDataSouce;

  constructor(dataSource: IMessageAPIDataSouce) {
    this.dataSource = dataSource;
  }

  async getPendingMessages(): Promise<MessageModel[]> {
    const res = await this.dataSource.getPendingMessages();

    const messageModels: MessageModel[] = [];

    for (let message of res) {
      messageModels.push(modelMessageData(message));
    }

    return messageModels;
  }

  deletePendingMessages(ids: string[]) {
    return this.dataSource.deletePendingMessages(ids);
  }
}
