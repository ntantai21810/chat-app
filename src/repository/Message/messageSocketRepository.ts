import { IMessage, MessageModel } from "../../domains/Message";
import { normalizeMessageData } from "../../domains/Message/helper";
import { ISendMessageRepo } from "../../useCases/Message/sendMessageSocketUseCase";

export interface IMessageSocketDataSouce {
  sendMessage(message: IMessage): void;
  // sendTyping(userId: string, isTyping: boolean): void;
  // listenTyping(callback: (userId: string, isTyping: boolean) => void): void;
  // removeListenTyping(): void;
}

export default class MessageSocketRepository implements ISendMessageRepo {
  // IListenTypingRepo,
  // IRemoveListenTypingRepo,
  // ISendTypingRepo
  private dataSource: IMessageSocketDataSouce;

  constructor(dataSource: IMessageSocketDataSouce) {
    this.dataSource = dataSource;
  }

  sendMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dataSource.sendMessage(message);
  }

  // sendTyping(toUserId: string, isTyping: boolean): void {
  //   this.dataSource.sendTyping(toUserId, isTyping);
  // }

  // listenTyping(callback: (userId: string, isTyping: boolean) => void): void {
  //   this.dataSource.listenTyping(callback);
  // }

  // removeListenTyping(): void {
  //   this.dataSource.removeListenTyping();
  // }
}
