import { getDispatch } from "../../adapter/frameworkAdapter";
import { IMessage, MessageModel } from "../../domains/Message";
import { normalizeMessageData } from "../../domains/Message/helper";
import {
  addMessage,
  setMessage,
  setMessageDBLoaded,
  setMessageError,
  setMessageLoading,
  setMessageTyping,
} from "../../framework/redux/message";
import { IMessagePresenter } from "./IMessagePresenter";

export default class MessagePresenter implements IMessagePresenter {
  private dispatch;

  constructor() {
    this.dispatch = getDispatch();
  }

  setMessages(otherUserId: string, messageModels: MessageModel[]): void {
    const messages: IMessage[] = [];

    for (let messageModel of messageModels) {
      const message = normalizeMessageData(messageModel);

      messages.push(message);
    }

    this.dispatch(
      setMessage({
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

  addMessage(otherUserId: string, messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dispatch(
      addMessage({
        userId: otherUserId,
        message: message,
      })
    );
  }

  setTyping(isTyping: boolean): void {
    this.dispatch(setMessageTyping(isTyping));
  }
}
