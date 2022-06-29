import { getDispatch } from "../../adapter/frameworkAdapter";
import {
  ConversationModel,
  IConversation,
  normalizeConversationData,
} from "../../domains";
import {
  addManyConversation,
  addOneConversation,
  removeAllConversation,
  updateOneConversation,
} from "../../framework/redux";
import { IConversationPresenter } from "./IConversationPresenter";

export class ConversationPresenter implements IConversationPresenter {
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
