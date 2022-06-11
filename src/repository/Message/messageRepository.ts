import { IMessageDataSouce } from "../../dataSource";
import { MessageModel } from "../../domains/Message";
import { modelMessageData } from "../../domains/Message/helper";
import { IConnectDBMessageRepo } from "../../useCases/Message/connectDBUseCase";
import { IGetMessageRepo } from "../../useCases/Message/getMessageUseCase";

export default class MessageRepository
  implements IConnectDBMessageRepo, IGetMessageRepo
{
  private dataSource: IMessageDataSouce;

  constructor(dataSource: IMessageDataSouce) {
    this.dataSource = dataSource;
  }

  connect(): Promise<any> {
    return this.dataSource.connect();
  }

  async getMessages(myId: string, otherId: string): Promise<MessageModel[]> {
    const res = await this.dataSource.getMessages(myId, otherId);

    const messageModels: MessageModel[] = [];

    for (let message of res) {
      messageModels.push(modelMessageData(message));
    }

    return messageModels;
  }
}
