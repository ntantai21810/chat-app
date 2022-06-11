import { IConversationDataSouce } from "../../dataSource";
import {
  ConversationModel,
  modelConversationData,
} from "../../domains/Conversation";
import { IGetConversationRepo } from "../../useCases";
import { IConnectDBConversationRepo } from "../../useCases/Conversation/connectDBUseCase";

export default class ConversationRepository
  implements IConnectDBConversationRepo, IGetConversationRepo
{
  private dataSource: IConversationDataSouce;

  constructor(dataSource: IConversationDataSouce) {
    this.dataSource = dataSource;
  }

  connect(): Promise<any> {
    return this.dataSource.connect();
  }

  async getConversations(): Promise<ConversationModel[]> {
    const conversationModels: ConversationModel[] = [];

    const res = await this.dataSource.getConversations();

    for (let conversation of res) {
      const conversationModel = modelConversationData(conversation);
      conversationModels.push(conversationModel);
    }

    return conversationModels;
  }
}
