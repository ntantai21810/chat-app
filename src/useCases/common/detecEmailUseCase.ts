import { IPosition } from ".";

export interface IDetectEmailRepo {
  detectEmail(id: string, text: string): Promise<IPosition[]>;
}

export class DetectEmailUseCase {
  private repository: IDetectEmailRepo;

  constructor(repository: IDetectEmailRepo) {
    this.repository = repository;
  }

  async execute(id: string, text: string): Promise<IPosition[]> {
    try {
      const res = await this.repository.detectEmail(id, text);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
