import { MessageModel } from "../../domains";

export interface IDetectPhoneMessagesRepo {
  detectPhoneMessages(messageModels: MessageModel[]): Promise<MessageModel[]>;
}

export class DetectPhoneMessagesUseCase {
  private repository: IDetectPhoneMessagesRepo;

  constructor(repository: IDetectPhoneMessagesRepo) {
    this.repository = repository;
  }

  async execute(messageModels: MessageModel[]) {
    try {
      const res = await this.repository.detectPhoneMessages(messageModels);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
