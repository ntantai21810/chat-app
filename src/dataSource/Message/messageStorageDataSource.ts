import { IFile, IMessage, MessageType } from "../../domains";
import { tokenizer } from "../../helper";
import { IDatabase } from "../../storage";

export class MessageStorageDataSource {
  private database: IDatabase;

  constructor(database: IDatabase) {
    this.database = database;
  }

  async getMessagesByConversation(
    conversationId: string,
    fromMessage?: IMessage,
    toMessage?: IMessage,
    limit?: number,
    exceptBound?: boolean
  ): Promise<IMessage[]> {
    const res = await this.database.get<IMessage>(
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

    return res;
  }

  async addMessage(message: IMessage): Promise<void> {
    this.database.add<IMessage>("message", "message", message);

    //Add to search DB
    const tokens = tokenizer(
      message.type === MessageType.TEXT
        ? (message.content as string)
        : (message.content as IFile[]).map((file) => file.name).join(" ")
    );

    for (let token in tokens) {
      let keywordId: string = "";

      const keyword = await this.database.getOne("keyword", "keyword", token);

      if (!keyword) {
        const count = await this.database.count("keyword", "keyword");

        keywordId = count + 1 + "";

        this.database.add("keyword", "keyword", {
          keyword: token,
          id: keywordId,
        });
      } else {
        keywordId = (keyword as any).id;
      }

      this.database.add("keywordIdx", "keywordIdx", {
        keywordId,
        fromId: message.fromId,
        toId: message.toId,
        clientId: message.clientId,
        freq: tokens[token],
      });
    }
  }

  updateMessage(message: IMessage) {
    return this.database.update<IMessage>("message", "message", message);
  }

  deleteMessage(message: IMessage) {
    return this.database.delete<IMessage>("message", "message", [
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
      keywordId: string;
      freq: number;
    }

    const tokens = tokenizer(text);
    const keywords = Object.keys(tokens);

    const tokenResultkeys: ISearchDB[][] = [];

    for (let i = 0; i < keywords.length; i++) {
      const searchPromises: Promise<ISearchDB[]>[] = [];

      const matchKeywords = await this.database.get(
        "keyword",
        "keyword",
        IDBKeyRange.bound(
          i === keywords.length - 1
            ? keywords[i].slice(0, -1) +
                String.fromCharCode(
                  keywords[i].charCodeAt(keywords[i].length - 1)
                )
            : keywords[i],
          i === keywords.length - 1
            ? keywords[i].slice(0, -1) +
                String.fromCharCode(
                  keywords[i].charCodeAt(keywords[i].length - 1) + 1
                )
            : keywords[i],
          false,
          i === keywords.length - 1
        ),
        "keywordId"
      );

      if (matchKeywords.length === 0) return [];

      for (let matchKeyword of matchKeywords) {
        searchPromises.push(
          this.database.get<ISearchDB>(
            "keywordIdx",
            "keywordIdx",
            IDBKeyRange.bound(
              [(matchKeyword as any).id, tokens[keywords[i]]],
              [(matchKeyword as any).id, Number.MAX_SAFE_INTEGER]
            ),
            "search"
          )
        );
      }

      const messages: ISearchDB[][] = await Promise.all(searchPromises);
      const flattedMessage: ISearchDB[] = messages.flat();

      tokenResultkeys.push(
        flattedMessage.filter(
          (item, index) =>
            flattedMessage.findIndex(
              (i) =>
                i.clientId === item.clientId &&
                i.toId === item.toId &&
                i.fromId === item.fromId
            ) === index
        )
      );
    }

    let msgKeys: ISearchDB[] = [];

    if (tokenResultkeys.length > 1) {
      msgKeys = tokenResultkeys.reduce((a, b) =>
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
