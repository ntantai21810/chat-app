import { MessageModel } from "../../domains";

export interface IMessagePresenter {
  addMessages(messageModels: Array<MessageModel>): void;
  addMessage(messageModel: MessageModel): void;
  updateMessage(messageModel: MessageModel): void;
  deleteMessage(messageModel: MessageModel): void;
  removeAllMessage(): void;
  setShowNotification(show: boolean): void;
}
