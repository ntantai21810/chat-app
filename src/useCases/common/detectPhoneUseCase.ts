import { IPosition } from ".";

export interface IDetectPhoneRepo {
  detectPhone(text: string): Promise<IPosition[]>;
}

export class DetectPhoneUseCase {
  private repository: IDetectPhoneRepo;

  constructor(repository: IDetectPhoneRepo) {
    this.repository = repository;
  }

  async execute(text: string): Promise<IPosition[]> {
    try {
      const res = await this.repository.detectPhone(text);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
