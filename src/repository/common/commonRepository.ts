import {
  IDetectEmailRepo,
  IDetectPhoneRepo,
  IDetectUrlRepo,
  IPosition,
} from "../../useCases";

export interface ICommonDataSource {
  detectPhone(text: string): Promise<IPosition[]>;
  detectUrl(text: string): Promise<IPosition[]>;
  detectEmail(text: string): Promise<IPosition[]>;
}
export class CommonRepository
  implements IDetectPhoneRepo, IDetectUrlRepo, IDetectEmailRepo
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
}
