import { IMessage, MessageModel } from ".";

export function modelMessageData(message: IMessage): MessageModel {
  const { fromId, toId, type, content, sendTime } = message;

  return new MessageModel(fromId, toId, type, content, sendTime);
}

export function normalizeMessageData(messageModel: MessageModel): IMessage {
  return {
    fromId: messageModel.getFromId(),
    toId: messageModel.getToId(),
    type: messageModel.getType(),
    content: messageModel.getContent(),
    sendTime: messageModel.getSendTime(),
  };
}
