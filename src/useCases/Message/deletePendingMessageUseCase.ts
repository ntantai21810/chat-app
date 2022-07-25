export interface IDeletePendingMessageRepo {
  deletePendingMessages(ids: string[]): Promise<void>;
}

export class DeletePendingMessageUseCase {
  private repository: IDeletePendingMessageRepo;

  constructor(repository: IDeletePendingMessageRepo) {
    this.repository = repository;
  }

  async execute(ids: string[]) {
    try {
      return this.repository.deletePendingMessages(ids);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
