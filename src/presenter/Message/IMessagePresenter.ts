import { MessageModel } from "../../domains/Message";

export interface IMessagePresenter {
  addMessages(messageModels: Array<MessageModel>): void;
  addMessage(messageModel: MessageModel): void;
}
