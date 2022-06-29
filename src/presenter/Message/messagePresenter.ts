import { getDispatch } from "../../adapter/frameworkAdapter";
import { IMessage, MessageModel, normalizeMessageData } from "../../domains";
import {
  addManyMessage,
  addOneMessage,
  removeAllMessage,
  removeOneMessage,
  setShowNotification,
  updateOneMessage,
} from "../../framework/redux";
import { IMessagePresenter } from "./IMessagePresenter";

export class MessagePresenter implements IMessagePresenter {
  private dispatch;

  constructor() {
    this.dispatch = getDispatch();
  }

  addMessages(messageModels: MessageModel[]): void {
    const messages: IMessage[] = [];

    for (let messageModel of messageModels) {
      const message = normalizeMessageData(messageModel);

      messages.push(message);
    }

    this.dispatch(addManyMessage(messages));
  }

  addMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dispatch(addOneMessage(message));
  }

  updateMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dispatch(updateOneMessage(message));
  }

  deleteMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dispatch(removeOneMessage(message));
  }

  removeAllMessage(): void {
    this.dispatch(removeAllMessage());
  }

  setShowNotification(show: boolean): void {
    this.dispatch(setShowNotification(show));
  }
}
