import {
  ConversationModel,
  IConversation,
  modelConversationData,
  normalizeConversationData,
} from "../../domains/Conversation";
import { IGetAllConversationRepo } from "../../useCases";
import { IAddConversationRepo } from "../../useCases/Conversation/addConversationUseCase";
import { IGetConversationByIdRepo } from "../../useCases/Conversation/getConversationByIdUseCase";
import { IGetConversationByUserIdRepo } from "../../useCases/Conversation/getConversationByUserIdUseCase";
import { IUpdateConversationRepo } from "../../useCases/Conversation/updateConversationUseCase";

export interface IConversationStorageDataSource {
  getConversations(): Promise<IConversation[]>;
  getConversationByUserId(userId: string): Promise<IConversation | null>;
  getConversationById(id: string): Promise<IConversation | null>;
  addConversation(conversation: IConversation): void;
  updateConversation(conversation: IConversation): void;
}

export default class ConversationStorageRepository
  implements
    IGetAllConversationRepo,
    IGetConversationByUserIdRepo,
    IAddConversationRepo,
    IUpdateConversationRepo,
    IGetConversationByIdRepo
{
  private dataSource: IConversationStorageDataSource;

  constructor(dataSource: IConversationStorageDataSource) {
    this.dataSource = dataSource;
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

  async getConversationByUserId(
    userId: string
  ): Promise<ConversationModel | null> {
    const res = await this.dataSource.getConversationByUserId(userId);

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

  async getConversationById(userId: string): Promise<ConversationModel | null> {
    const res = await this.dataSource.getConversationById(userId);

    if (res) {
      const conversationModel = modelConversationData(res);

      return conversationModel;
    } else return null;
  }
}
