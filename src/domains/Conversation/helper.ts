import { ConversationModel, IConversation } from ".";
import { MessageModel } from "../Message";
import { UserModel } from "../User";

export function modelConversationData(
  conversation: IConversation
): ConversationModel {
  const { user, lastMessage, lastOnlineTime } = conversation;

  const userModel = new UserModel(
    user._id,
    user.fullName,
    user.phone,
    user.avatar
  );
  const lastMessageModel = new MessageModel(
    lastMessage.fromId,
    lastMessage.toId,
    lastMessage.type,
    lastMessage.content,
    lastMessage.sendTime
  );

  return new ConversationModel(userModel, lastMessageModel, lastOnlineTime);
}

export function normalizeConversationData(
  conversationModel: ConversationModel
): IConversation {
  const userModel = conversationModel.getUser();
  const lastMessageModel = conversationModel.getLastMessage();
  const lastOnlineTime = conversationModel.getLastOnlineTime();

  const conversation: IConversation = {
    user: {
      _id: userModel.getId(),
      fullName: userModel.getFullName(),
      phone: userModel.getPhone(),
      avatar: userModel.getAvatar(),
    },
    lastMessage: {
      fromId: lastMessageModel.getFromId(),
      toId: lastMessageModel.getToId(),
      type: lastMessageModel.getType(),
      content: lastMessageModel.getContent(),
      sendTime: lastMessageModel.getSendTime(),
    },
    lastOnlineTime: lastOnlineTime,
  };

  return conversation;
}
