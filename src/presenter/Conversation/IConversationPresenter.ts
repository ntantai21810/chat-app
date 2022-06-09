import { ConversationModel } from "../../domains/Conversation";

export interface IConversationPresenter {
  setConversations(conversationModels: Array<ConversationModel>): void;
  setLoading(isLoading: boolean): void;
  setError(error: string): void;
  setDBLoaded(isLoaded: boolean): void;
}
