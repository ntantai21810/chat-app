import { AxiosRequestConfig } from "axios";
import { IMessageThumb } from "../../domains";
import { IAPI } from "../../network";
import { ICommonDataSource } from "../../repository";
import { IPosition } from "../../useCases";

export class CommonDataSource implements ICommonDataSource {
  private datasource: Worker | IAPI;

  constructor(worker: Worker | IAPI) {
    this.datasource = worker;
  }

  detectPhone(text: string): Promise<IPosition[]> {
    return new Promise((resolve, reject) => {
      (this.datasource as Worker).postMessage({
        type: "phone-detect",
        text: text,
      });

      const handleDetect = (ev: MessageEvent<any>) => {
        if (ev.data.type === "phone-detect-result") {
          (this.datasource as Worker).removeEventListener(
            "message",
            handleDetect
          );
          resolve(ev.data.text);
        }
      };

      (this.datasource as Worker).addEventListener("message", handleDetect);
    });
  }

  detectUrl(text: string): Promise<IPosition[]> {
    return new Promise((resolve, reject) => {
      (this.datasource as Worker).postMessage({
        type: "url-detect",
        text: text,
      });

      const handleDetect = (ev: MessageEvent<any>) => {
        if (ev.data.type === "url-detect-result") {
          (this.datasource as Worker).removeEventListener(
            "message",
            handleDetect
          );
          resolve(ev.data.text);
        }
      };

      (this.datasource as Worker).addEventListener("message", handleDetect);
    });
  }

  detectEmail(text: string): Promise<IPosition[]> {
    return new Promise((resolve, reject) => {
      (this.datasource as Worker).postMessage({
        type: "email-detect",
        text: text,
      });

      const handleDetect = (ev: MessageEvent<any>) => {
        if (ev.data.type === "email-detect-result") {
          (this.datasource as Worker).removeEventListener(
            "message",
            handleDetect
          );
          resolve(ev.data.text);
        }
      };

      (this.datasource as Worker).addEventListener("message", handleDetect);
    });
  }

  previewLink(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<IMessageThumb> {
    return (this.datasource as IAPI).get(
      "/preview-link",
      {
        url,
      },
      options
    );
  }
}
