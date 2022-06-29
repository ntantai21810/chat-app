export interface IRemoveAllListenerSocketRepo {
  removeAllListener(channel: string): void;
}

export class RemoveAllListenerSocketUseCase {
  private repository: IRemoveAllListenerSocketRepo;

  constructor(repository: IRemoveAllListenerSocketRepo) {
    this.repository = repository;
  }

  async execute(channel: string) {
    try {
      this.repository.removeAllListener(channel);
    } catch (e) {
      throw e;
    }
  }
}
