import { getDispatch } from "../../adapter/frameworkAdapter";
import {
  IMessage,
  MessageModel,
  MessageType,
  normalizeMessageData,
} from "../../domains";
import {
  addManyMessage,
  addOneMessage,
  removeAllMessage,
  removeOneMessage,
  setShowNotification,
  updateOneMessage,
} from "../../framework/redux";
import { normalizeHTMLTag } from "../../helper";
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

      if (message.type === MessageType.TEXT) {
        message.content = normalizeHTMLTag(message.content as string);
      }

      messages.push(message);
    }

    this.dispatch(addManyMessage(messages));
  }

  addMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    if (message.type === MessageType.TEXT) {
      message.content = normalizeHTMLTag(message.content as string);
    }

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
