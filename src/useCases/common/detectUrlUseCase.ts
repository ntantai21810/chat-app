import { IPosition } from ".";

export interface IDetectUrlRepo {
  detectUrl(text: string): Promise<IPosition[]>;
}

export class DetectUrlUseCase {
  private repository: IDetectUrlRepo;

  constructor(repository: IDetectUrlRepo) {
    this.repository = repository;
  }

  async execute(text: string): Promise<IPosition[]> {
    try {
      const res = await this.repository.detectUrl(text);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
