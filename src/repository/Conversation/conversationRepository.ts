import { modelConversationData } from "../../controller/Conversation/helper";
import { ConversationModel } from "../../domains/Conversation";
import { IConversationStorage } from "./../../storage/IStorage";
import { IConversationRepository } from "./IConversationRepository";

export default class ConversationRepository implements IConversationRepository {
  private storage: IConversationStorage;

  constructor(storage: IConversationStorage) {
    this.storage = storage;
  }

  connect(): Promise<any> {
    return this.storage.connect();
  }

  async getConversations(): Promise<ConversationModel[]> {
    const res = await this.storage.getConversations();

    console.log({ res });

    const conversationModels: ConversationModel[] = [];

    for (let conversation of res) {
      conversationModels.push(modelConversationData(conversation));
    }
    return conversationModels;
  }
}
