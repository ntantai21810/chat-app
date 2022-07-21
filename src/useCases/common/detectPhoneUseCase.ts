import { IPosition } from ".";

export interface IDetectPhoneRepo {
  detectPhone(id: string, text: string): Promise<IPosition[]>;
}

export class DetectPhoneUseCase {
  private repository: IDetectPhoneRepo;

  constructor(repository: IDetectPhoneRepo) {
    this.repository = repository;
  }

  async execute(id: string, text: string): Promise<IPosition[]> {
    try {
      const res = await this.repository.detectPhone(id, text);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
