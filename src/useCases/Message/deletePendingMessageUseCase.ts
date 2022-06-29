export interface IDeletePendingMessageRepo {
  deletePendingMessages(ids: string[]): void;
}

export class DeletePendingMessageUseCase {
  private repository: IDeletePendingMessageRepo;

  constructor(repository: IDeletePendingMessageRepo) {
    this.repository = repository;
  }

  execute(ids: string[]) {
    try {
      this.repository.deletePendingMessages(ids);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
