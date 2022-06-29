import { IMessage } from "../../domains";
import { IMessageAPIDataSouce } from "../../repository";

export interface IMessageAPI {
  getPendingMessages: () => Promise<IMessage[]>;
  deletePendingMessages: (ids: string[]) => void;
}

export class MessageAPIDataSource implements IMessageAPIDataSouce {
  private api: IMessageAPI;

  constructor(api: IMessageAPI) {
    this.api = api;
  }

  getPendingMessages(): Promise<IMessage[]> {
    return this.api.getPendingMessages();
  }

  deletePendingMessages(ids: string[]): void {
    this.api.deletePendingMessages(ids);
  }
}
