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
  detectPhone(text: string): Promise<IPosition[]>;
  detectUrl(text: string): Promise<IPosition[]>;
  detectEmail(text: string): Promise<IPosition[]>;
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

  detectPhone(text: string): Promise<IPosition[]> {
    return this.dataSource.detectPhone(text);
  }

  detectUrl(text: string): Promise<IPosition[]> {
    return this.dataSource.detectUrl(text);
  }

  detectEmail(text: string): Promise<IPosition[]> {
    return this.dataSource.detectEmail(text);
  }

  previewLink(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<IMessageThumb> {
    return this.dataSource.previewLink(url, options);
  }
}
