import { IDetectPhoneMessagesRepo } from "./../../useCases/common/detectPhoneMessagesUseCase";
import { IDetectPhoneRepo } from "../../useCases";
import {
  IMessage,
  MessageModel,
  modelMessageData,
  normalizeMessageData,
} from "../../domains";

export interface ICommonDataSource {
  detectPhone(text: string): Promise<string>;
  detectPhoneMessages(messages: IMessage[]): Promise<IMessage[]>;
}
export class CommonRepository
  implements IDetectPhoneRepo, IDetectPhoneMessagesRepo
{
  private dataSource: ICommonDataSource;

  constructor(dataSource: ICommonDataSource) {
    this.dataSource = dataSource;
  }

  detectPhone(text: string): Promise<string> {
    return this.dataSource.detectPhone(text);
  }

  async detectPhoneMessages(
    messageModels: MessageModel[]
  ): Promise<MessageModel[]> {
    const messages: IMessage[] = [];

    for (let messageModel of messageModels) {
      messages.push(normalizeMessageData(messageModel));
    }

    const res = await this.dataSource.detectPhoneMessages(messages);

    const result: MessageModel[] = [];

    for (let message of res) {
      result.push(modelMessageData(message));
    }

    return result;
  }
}
