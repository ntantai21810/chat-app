export interface IRemoveAllListenerSocketRepo {
  removeAllListener(channel: string): void;
}

export default class RemoveAllListenerSocketUseCase {
  private repository: IRemoveAllListenerSocketRepo;

  constructor(repository: IRemoveAllListenerSocketRepo) {
    this.repository = repository;
  }

  async execute(channel: string) {
    this.repository.removeAllListener(channel);
  }
}
