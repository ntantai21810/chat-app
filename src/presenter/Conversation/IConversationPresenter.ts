import { ConversationModel } from "../../domains";

export interface IConversationPresenter {
  setConversations(conversationModels: Array<ConversationModel>): void;
  addConversation(conversationModel: ConversationModel): void;
  updateConversation(conversationModel: ConversationModel): void;
}
