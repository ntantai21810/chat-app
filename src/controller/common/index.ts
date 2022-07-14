import { CommonDataSource } from "../../dataSource";
import {
  IMessage,
  MessageModel,
  modelMessageData,
  normalizeMessageData,
} from "../../domains";
import { CommonRepository } from "../../repository";
import { DetectPhoneMessagesUseCase } from "../../useCases";
import { parserWorker } from "../../views/pages/Chat";
import { DetectPhoneUseCase } from "./../../useCases/common/detectPhoneUseCase";

export class CommonController {
  async detectPhone(text: string): Promise<string> {
    try {
      const detectPhoneUseCase = new DetectPhoneUseCase(
        new CommonRepository(new CommonDataSource(parserWorker))
      );

      const res = await detectPhoneUseCase.execute(text);

      return res;
    } catch (e) {
      throw e;
    }
  }

  async detectPhoneMessages(messages: IMessage[]): Promise<IMessage[]> {
    try {
      const detectPhoneMessagesUseCase = new DetectPhoneMessagesUseCase(
        new CommonRepository(new CommonDataSource(parserWorker))
      );

      const transforms: MessageModel[] = [];

      for (let message of messages) {
        transforms.push(modelMessageData(message));
      }

      const res = await detectPhoneMessagesUseCase.execute(transforms);

      const result: IMessage[] = [];

      for (let messageModel of res) {
        result.push(normalizeMessageData(messageModel));
      }

      return result;
    } catch (e) {
      throw e;
    }
  }
}
