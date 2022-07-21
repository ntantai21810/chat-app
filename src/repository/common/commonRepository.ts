import { AxiosRequestConfig } from "axios";
import { IMessageThumb } from "../../domains";
import {
  IDetectEmailRepo,
  IDetectPhoneRepo,
  IDetectUrlRepo,
  IPosition,
  IPreviewLinkRepo,
} from "../../useCases";

export interface ICommonDataSource {
  detectPhone(id: string, text: string): Promise<IPosition[]>;
  detectUrl(id: string, text: string): Promise<IPosition[]>;
  detectEmail(id: string, text: string): Promise<IPosition[]>;
  previewLink(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<IMessageThumb>;
}
export class CommonRepository
  implements
    IDetectPhoneRepo,
    IDetectUrlRepo,
    IDetectEmailRepo,
    IPreviewLinkRepo
{
  private dataSource: ICommonDataSource;

  constructor(dataSource: ICommonDataSource) {
    this.dataSource = dataSource;
  }

  detectPhone(id: string, text: string): Promise<IPosition[]> {
    return this.dataSource.detectPhone(id, text);
  }

  detectUrl(id: string, text: string): Promise<IPosition[]> {
    return this.dataSource.detectUrl(id, text);
  }

  detectEmail(id: string, text: string): Promise<IPosition[]> {
    return this.dataSource.detectEmail(id, text);
  }

  previewLink(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<IMessageThumb> {
    return this.dataSource.previewLink(url, options);
  }
}
