import { ConversationModel, IConversation } from ".";
import { MessageModel, normalizeMessageData } from "../Message";

export function modelConversationData(
  conversation: IConversation
): ConversationModel {
  const { userId, lastMessage, id } = conversation;

  const lastMessageModel = new MessageModel(
    lastMessage.fromId,
    lastMessage.toId,
    lastMessage.conversationId,
    lastMessage.type,
    lastMessage.content,
    lastMessage.clientId,
    lastMessage.sendTime,
    lastMessage.status,
    lastMessage.id
  );

  const conversationModel = new ConversationModel(userId, lastMessageModel);

  conversationModel.setId(id);

  return conversationModel;
}

export function normalizeConversationData(
  conversationModel: ConversationModel
): IConversation {
  const id = conversationModel.getId();
  const userId = conversationModel.getUserId();
  const lastMessageModel = conversationModel.getLastMessage();

  const conversation: IConversation = {
    id,
    userId,
    lastMessage: normalizeMessageData(lastMessageModel),
  };

  return conversation;
}
