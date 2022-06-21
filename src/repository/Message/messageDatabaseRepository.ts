import { IQueryOption } from "../../domains/common/helper";
import { IMessage, MessageModel } from "../../domains/Message";
import {
  modelMessageData,
  normalizeMessageData,
} from "../../domains/Message/helper";
import { IGetMessageRepo } from "../../useCases";
import { IAddMessageRepo } from "../../useCases/Message/addMessageDatabaseUseCase";

export interface IMessageDatabaseDataSouce {
  getMessagesByConversation(
    conversationId: string,
    options?: IQueryOption
  ): Promise<IMessage[]>;
  addMessage(message: IMessage): void;
}

export default class MessageDatabaseRepository
  implements IGetMessageRepo, IAddMessageRepo
{
  private dataSource: IMessageDatabaseDataSouce;

  constructor(dataSource: IMessageDatabaseDataSouce) {
    this.dataSource = dataSource;
  }

  async getMessagesByConversation(
    conversationId: string,
    options?: IQueryOption
  ): Promise<MessageModel[]> {
    const res = await this.dataSource.getMessagesByConversation(
      conversationId,
      options
    );

    const messageModels: MessageModel[] = [];

    for (let message of res) {
      messageModels.push(modelMessageData(message));
    }

    return messageModels;
  }

  addMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dataSource.addMessage(message);
  }
}
