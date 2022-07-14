export interface IDetectPhoneRepo {
  detectPhone(text: string): Promise<string>;
}

export class DetectPhoneUseCase {
  private repository: IDetectPhoneRepo;

  constructor(repository: IDetectPhoneRepo) {
    this.repository = repository;
  }

  async execute(text: string) {
    try {
      const res = await this.repository.detectPhone(text);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
