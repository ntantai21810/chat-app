import { normalizeMessageData } from "../../controller/Message/helper";
import { IMessage, MessageModel } from "../../domains/Message";
import {
  addMessage,
  setMessageDBLoaded,
  setMessageError,
  setMessageLoading,
} from "../../framework/redux/message";
import { store } from "../../framework/redux/store";
import { IMessagePresenter } from "./IMessagePresenter";

export default class MessagePresenter implements IMessagePresenter {
  private dispatch;

  constructor() {
    this.dispatch = store.dispatch;
  }

  setMessages(otherUserId: string, messageModels: MessageModel[]): void {
    const messages: IMessage[] = [];

    for (let messageModel of messageModels) {
      const message = normalizeMessageData(messageModel);

      messages.push(message);
    }

    this.dispatch(
      addMessage({
        userId: otherUserId,
        message: messages,
      })
    );
  }

  setLoading(isLoading: boolean): void {
    this.dispatch(setMessageLoading(isLoading));
  }

  setError(error: string): void {
    this.dispatch(setMessageError(error));
  }

  setDBLoaded(isLoaded: boolean): void {
    this.dispatch(setMessageDBLoaded(isLoaded));
  }
}
