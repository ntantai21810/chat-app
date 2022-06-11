import { IConversation } from "./../../domains/Conversation/IConversation";
import { ConversationModel } from "../../domains/Conversation";
import { store } from "../../framework/redux/store";
import { IConversationPresenter } from "./IConversationPresenter";
import { normalizeConversationData } from "../../domains/Conversation/helper";
import {
  setConversationDBLoaded,
  setConversationError,
  setConversationLoading,
  setConversations,
} from "../../framework/redux/conversation";

export default class ConversationPresenter implements IConversationPresenter {
  private dispatch;

  constructor() {
    this.dispatch = store.dispatch;
  }

  setConversations(conversationModels: ConversationModel[]): void {
    const conversations: IConversation[] = [];

    for (let conversationModel of conversationModels) {
      const conversation = normalizeConversationData(conversationModel);

      conversations.push(conversation);
    }

    this.dispatch(setConversations(conversations));
  }

  setLoading(isLoading: boolean): void {
    this.dispatch(setConversationLoading(isLoading));
  }

  setError(error: string): void {
    this.dispatch(setConversationError(error));
  }

  setDBLoaded(isLoaded: boolean): void {
    this.dispatch(setConversationDBLoaded(isLoaded));
  }
}
