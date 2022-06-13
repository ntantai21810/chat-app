import { IConversationDataSouce } from "../../dataSource";
import {
  ConversationModel,
  modelConversationData,
  normalizeConversationData,
} from "../../domains/Conversation";
import { IGetAllConversationRepo } from "../../useCases";
import { IAddConversationRepo } from "../../useCases/Conversation/addConversationUseCase";
import { IConnectDBConversationRepo } from "../../useCases/Conversation/connectDBUseCase";
import { IGetConversationRepo } from "../../useCases/Conversation/getConversationUseCase";
import { IUpdateConversationRepo } from "../../useCases/Conversation/updateConversationUseCase";

export default class ConversationRepository
  implements
    IConnectDBConversationRepo,
    IGetAllConversationRepo,
    IGetConversationRepo,
    IAddConversationRepo,
    IUpdateConversationRepo
{
  private dataSource: IConversationDataSouce;

  constructor(dataSource: IConversationDataSouce) {
    this.dataSource = dataSource;
  }

  connect(): Promise<any> {
    return this.dataSource.connect();
  }

  async getAllConversations(): Promise<ConversationModel[]> {
    const conversationModels: ConversationModel[] = [];

    const res = await this.dataSource.getConversations();

    for (let conversation of res) {
      const conversationModel = modelConversationData(conversation);
      conversationModels.push(conversationModel);
    }

    return conversationModels;
  }

  async getConversation(userId: string): Promise<ConversationModel | null> {
    const res = await this.dataSource.getConversation(userId);

    if (res) {
      const conversationModel = modelConversationData(res);

      return conversationModel;
    } else return null;
  }

  addConversation(conversationModel: ConversationModel): void {
    const conversation = normalizeConversationData(conversationModel);

    this.dataSource.addConversation(conversation);
  }

  updateConversation(conversationModel: ConversationModel): void {
    const conversation = normalizeConversationData(conversationModel);

    this.dataSource.updateConversation(conversation);
  }
}
