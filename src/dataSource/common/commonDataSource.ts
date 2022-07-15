import { ICommonDataSource } from "../../repository";
import { IPosition } from "../../useCases";

export class CommonDataSource implements ICommonDataSource {
  private worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;
  }

  detectPhone(text: string): Promise<IPosition[]> {
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

  detectUrl(text: string): Promise<IPosition[]> {
    return new Promise((resolve, reject) => {
      this.worker.postMessage({
        type: "url-detect",
        text: text,
      });

      const handleDetect = (ev: MessageEvent<any>) => {
        if (ev.data.type === "url-detect-result") {
          this.worker.removeEventListener("message", handleDetect);
          resolve(ev.data.text);
        }
      };

      this.worker.addEventListener("message", handleDetect);
    });
  }

  detectEmail(text: string): Promise<IPosition[]> {
    return new Promise((resolve, reject) => {
      this.worker.postMessage({
        type: "email-detect",
        text: text,
      });

      const handleDetect = (ev: MessageEvent<any>) => {
        if (ev.data.type === "email-detect-result") {
          this.worker.removeEventListener("message", handleDetect);
          resolve(ev.data.text);
        }
      };

      this.worker.addEventListener("message", handleDetect);
    });
  }
}
