import { MessageModel } from "../../domains/Message";

export interface IMessagePresenter {
  setMessages(otherUserId: string, messageModels: Array<MessageModel>): void;
  setLoading(isLoading: boolean): void;
  setError(error: string): void;
  setDBLoaded(isLoaded: boolean): void;
  addMessage(otherUserId: string, message: MessageModel): void;
}
