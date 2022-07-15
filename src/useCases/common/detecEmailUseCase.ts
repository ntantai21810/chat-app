import { IPosition } from ".";

export interface IDetectEmailRepo {
  detectEmail(text: string): Promise<IPosition[]>;
}

export class DetectEmailUseCase {
  private repository: IDetectEmailRepo;

  constructor(repository: IDetectEmailRepo) {
    this.repository = repository;
  }

  async execute(text: string): Promise<IPosition[]> {
    try {
      const res = await this.repository.detectEmail(text);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
