import { getDispatch } from "../../adapter/frameworkAdapter";
import { ConversationModel } from "../../domains/Conversation";
import { normalizeConversationData } from "../../domains/Conversation/helper";
import {
  addManyConversation,
  addOneConversation,
  removeAllConversation,
  updateOneConversation,
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

    this.dispatch(removeAllConversation());
    this.dispatch(addManyConversation(conversations));
  }

  addConversation(conversationModel: ConversationModel) {
    const conversation = normalizeConversationData(conversationModel);

    this.dispatch(addOneConversation(conversation));
  }

  updateConversation(conversationModel: ConversationModel): void {
    const conversation = normalizeConversationData(conversationModel);

    this.dispatch(
      updateOneConversation({
        id: conversationModel.getId(),
        changes: conversation,
      })
    );
  }
}
