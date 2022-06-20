import { MessageModel } from "../../domains/Message";

export interface IMessagePresenter {
  setMessages(messageModels: Array<MessageModel>): void;
  addMessage(messageModel: MessageModel): void;
}
