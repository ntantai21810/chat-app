import { IPosition } from ".";

export interface IDetectUrlRepo {
  detectUrl(id: string, text: string): Promise<IPosition[]>;
}

export class DetectUrlUseCase {
  private repository: IDetectUrlRepo;

  constructor(repository: IDetectUrlRepo) {
    this.repository = repository;
  }

  async execute(id: string, text: string): Promise<IPosition[]> {
    try {
      const res = await this.repository.detectUrl(id, text);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
