import { IMessage } from "../../domains";
import { ICommonDataSource } from "../../repository";

export class CommonDataSource implements ICommonDataSource {
  private worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;
  }

  detectPhone(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.worker.postMessage({
        type: "phone-detect",
        text: text,
      });

      const handleDetect = (ev: MessageEvent<any>) => {
        if (ev.data.type === "phone-detect-result") {
          this.worker.removeEventListener("message", handleDetect);
          resolve(ev.data.text);
        }
      };

      this.worker.addEventListener("message", handleDetect);
    });
  }

  detectPhoneMessages(messages: IMessage[]): Promise<IMessage[]> {
    return new Promise((resolve, reject) => {
      this.worker.postMessage({
        type: "phone-detect-messages",
        messages: messages,
      });

      const handleDetect = (ev: MessageEvent<any>) => {
        if (ev.data.type === "phone-detect-messages-result") {
          this.worker.removeEventListener("message", handleDetect);
          resolve(ev.data.messages);
        }
      };

      this.worker.addEventListener("message", handleDetect);
    });
  }
}
