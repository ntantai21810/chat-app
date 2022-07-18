import { AxiosRequestConfig } from "axios";
import { CommonDataSource } from "../../dataSource";
import { IMessageThumb } from "../../domains";
import { API } from "../../network";
import { CommonRepository } from "../../repository";
import {
  DetectEmailUseCase,
  DetectUrlUseCase,
  IPosition,
  PreviewLinkUseCase,
} from "../../useCases";
import { parserWorker } from "../../views/pages/Chat";
import { DetectPhoneUseCase } from "./../../useCases/common/detectPhoneUseCase";

export class CommonController {
  async detectPhone(text: string): Promise<IPosition[]> {
    try {
      const detectPhoneUseCase = new DetectPhoneUseCase(
        new CommonRepository(new CommonDataSource(parserWorker))
      );

      const res = await detectPhoneUseCase.execute(text);

      return res;
    } catch (e) {
      throw e;
    }
  }

  async detectUrl(text: string): Promise<IPosition[]> {
    try {
      const detectUrlUseCase = new DetectUrlUseCase(
        new CommonRepository(new CommonDataSource(parserWorker))
      );

      const res = await detectUrlUseCase.execute(text);

      return res;
    } catch (e) {
      throw e;
    }
  }

  async detectEmail(text: string): Promise<IPosition[]> {
    try {
      const detectEmailUseCase = new DetectEmailUseCase(
        new CommonRepository(new CommonDataSource(parserWorker))
      );

      const res = await detectEmailUseCase.execute(text);

      return res;
    } catch (e) {
      throw e;
    }
  }

  async previewLink(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<IMessageThumb> {
    try {
      const previewLinkUseCase = new PreviewLinkUseCase(
        new CommonRepository(new CommonDataSource(API.getIntance()))
      );

      const res = await previewLinkUseCase.execute(url, options);

      return res;
    } catch (e) {
      throw e;
    }
  }
}
