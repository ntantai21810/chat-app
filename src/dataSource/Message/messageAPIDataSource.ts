import { IMessage } from "../../domains";
import { IAPI } from "../../network";
import { IMessageAPIDataSouce } from "../../repository";

export class MessageAPIDataSource implements IMessageAPIDataSouce {
  private api: IAPI;

  constructor(api: IAPI) {
    this.api = api;
  }

  getPendingMessages(): Promise<IMessage[]> {
    return this.api.get("/messages/pending");
  }

  deletePendingMessages(ids: string[]) {
    return this.api.put("/messages/pending/delete", ids);
  }
}
