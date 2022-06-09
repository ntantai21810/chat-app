import { MessageModel } from "../../domains/Message";

export interface IMessageRepository {
  connect(): Promise<any>;
  getMessages(myId: string, otherId: string): Promise<MessageModel[]>;
}
