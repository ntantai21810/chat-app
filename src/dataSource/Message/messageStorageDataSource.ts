import { IFile, IMessage, MessageType } from "../../domains";
import { tokenizer } from "../../helper";
import { IDatabase } from "../../storage";

export class MessageStorageDataSource {
  private database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  getMessagesByConversation(
    conversationId: string,
    fromMessage?: IMessage,
    toMessage?: IMessage,
    limit?: number,
    exceptBound?: boolean
  ): Promise<IMessage[]> {
    return this.database.get<IMessage>(
      "message",
      "message",
      IDBKeyRange.bound(
        [
          conversationId,
          fromMessage?.sendTime || new Date(-8640000000000000).toISOString(),
        ],
        [conversationId, toMessage?.sendTime || new Date().toISOString()],
        !!exceptBound,
        !!exceptBound
      ),
      "messageSendTime",
      limit
    );
  }

  addMessage(message: IMessage): void {
    this.database.add<IMessage>("message", "message", message);

    //Add to search DB
    if (message.type === MessageType.TEXT) {
      const tokens = tokenizer(message.content as string);

      for (let keyword of tokens) {
        this.database.add("search", "search", {
          keyword,
          fromId: message.fromId,
          toId: message.toId,
          clientId: message.clientId,
        });
      }
    }

    if (message.type === MessageType.FILE) {
      const tokens = tokenizer(
        (message.content as IFile[]).map((file) => file.name).join(" ")
      );

      for (let keyword of tokens) {
        this.database.add("search", "search", {
          keyword,
          fromId: message.fromId,
          toId: message.toId,
          clientId: message.clientId,
        });
      }
    }
  }

  updateMessage(message: IMessage): void {
    this.database.update<IMessage>("message", "message", message);
  }

  deleteMessage(message: IMessage): void {
    this.database.delete<IMessage>("message", "message", [
      message.fromId,
      message.toId,
      message.clientId,
    ]);
  }

  async searchMessage(text: string): Promise<IMessage[]> {
    interface ISearchDB {
      fromId: string;
      toId: string;
      clientId: string;
      keyword: string;
    }

    const tokens = tokenizer(text);

    const searchPromises: Promise<ISearchDB[]>[] = [];

    for (let token of tokens) {
      searchPromises.push(
        this.database.get<ISearchDB>("search", "search", token, "keyword")
      );
    }

    const tokenResultkeys: ISearchDB[][] = await Promise.all(searchPromises);

    let msgKeys: ISearchDB[] = [];

    if (tokenResultkeys.length > 1) {
      msgKeys = Object.values(tokenResultkeys).reduce((a, b) =>
        a.filter((i) =>
          b.find(
            (item) =>
              item.clientId === i.clientId &&
              item.fromId === i.fromId &&
              item.toId === i.toId
          )
        )
      );
    } else {
      msgKeys = tokenResultkeys.length === 1 ? [...tokenResultkeys[0]] : [];
    }

    const messagePromises: Promise<IMessage | null>[] = [];

    for (let key of msgKeys) {
      messagePromises.push(
        this.database.getOne<IMessage>("message", "message", [
          key.fromId,
          key.toId,
          key.clientId,
        ])
      );
    }

    const messages = (await Promise.all(messagePromises)).filter(
      (item) => item !== null
    ) as IMessage[];

    return messages;
  }
}
