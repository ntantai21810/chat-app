import { IMessage, MessageModel } from ".";

export function modelMessageData(message: IMessage): MessageModel {
  const {
    fromId,
    toId,
    type,
    content,
    sendTime,
    id,
    conversationId,
    clientId,
  } = message;

  return new MessageModel(
    fromId,
    toId,
    conversationId,
    type,
    content,
    sendTime,
    clientId,
    id
  );
}

export function normalizeMessageData(messageModel: MessageModel): IMessage {
  return {
    id: messageModel.getId(),
    fromId: messageModel.getFromId(),
    toId: messageModel.getToId(),
    type: messageModel.getType(),
    content: messageModel.getContent(),
    conversationId: messageModel.getConversationId(),
    sendTime: messageModel.getSendTime(),
    clientId: messageModel.getClientId(),
  };
}
