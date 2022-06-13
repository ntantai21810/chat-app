import { IMessageDataSouce } from "../../dataSource";
import { MessageModel } from "../../domains/Message";
import {
  modelMessageData,
  normalizeMessageData,
} from "../../domains/Message/helper";
import { SOCKET_CONSTANTS } from "../../helper/constants";
import { ISocket } from "../../network";
import { IConnectDBMessageRepo } from "../../useCases/Message/connectDBUseCase";
import { IGetMessageRepo } from "../../useCases/Message/getMessageUseCase";
import { IListenMessageRepo } from "../../useCases/Message/listenMessageUseCase";
import { ISendMessageRepo } from "../../useCases/Message/sendMessageUseCase";

export default class MessageRepository
  implements
    IConnectDBMessageRepo,
    IGetMessageRepo,
    ISendMessageRepo,
    IListenMessageRepo
{
  private dataSource: IMessageDataSouce;
  private socket: ISocket;

  constructor(dataSource: IMessageDataSouce, socket?: ISocket) {
    this.dataSource = dataSource;

    if (socket) this.socket = socket;
  }

  connect(): Promise<any> {
    return this.dataSource.connect();
  }

  async getMessages(myId: string, otherId: string): Promise<MessageModel[]> {
    const res = await this.dataSource.getMessages(myId, otherId);

    const messageModels: MessageModel[] = [];

    for (let message of res) {
      messageModels.push(modelMessageData(message));
    }

    return messageModels;
  }

  sendMessage(messageModel: MessageModel): void {
    const message = normalizeMessageData(messageModel);

    this.dataSource.addMessage(message);
    this.socket.send(SOCKET_CONSTANTS.CHAT_MESSAGE, message);
  }

  listenMessage(
    channel: string,
    callback: (messageModel: MessageModel) => void
  ): void {
    this.dataSource.listenMessage(channel, (message) => {
      const messageModel = modelMessageData(message);

      callback(messageModel);
    });
  }
}
