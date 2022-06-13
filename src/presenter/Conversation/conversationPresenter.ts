import { getDispatch } from "../../adapter/frameworkAdapter";
import { ConversationModel } from "../../domains/Conversation";
import { normalizeConversationData } from "../../domains/Conversation/helper";
import {
  addConversation,
  setConversationDBLoaded,
  setConversationError,
  setConversationLoading,
  setConversations,
  updateConversation,
} from "../../framework/redux/conversation";
import { IConversation } from "./../../domains/Conversation/IConversation";
import { IConversationPresenter } from "./IConversationPresenter";

export default class ConversationPresenter implements IConversationPresenter {
  private dispatch;

  constructor() {
    this.dispatch = getDispatch();
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

  addConversation(conversationModel: ConversationModel) {
    const conversation = normalizeConversationData(conversationModel);

    this.dispatch(addConversation(conversation));
  }

  updateConversation(conversationModel: ConversationModel): void {
    const conversation = normalizeConversationData(conversationModel);

    this.dispatch(updateConversation(conversation));
  }
}
