import { getDispatch } from "../../adapter/frameworkAdapter";
import { IMessage, MessageModel } from "../../domains/Message";
import { normalizeMessageData } from "../../domains/Message/helper";
import {
  addManyMessage,
  addOneMessage,
  updateOneMessage,
} from "../../framework/redux/message";
import { IMessagePresenter } from "./IMessagePresenter";

export default class MessagePresenter implements IMessagePresenter {
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
}
