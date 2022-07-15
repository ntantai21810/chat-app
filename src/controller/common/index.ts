import { CommonDataSource } from "../../dataSource";
import { CommonRepository } from "../../repository";
import {
  DetectEmailUseCase,
  DetectUrlUseCase,
  IPosition,
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
}
