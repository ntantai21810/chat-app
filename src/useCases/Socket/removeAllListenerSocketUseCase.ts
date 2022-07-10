export interface IRemoveListenerSocketRepo {
  removeListener(
    channel: string,
    listener?: (...args: any[]) => void | undefined
  ): void;
}

export class RemoveListenerSocketUseCase {
  private repository: IRemoveListenerSocketRepo;

  constructor(repository: IRemoveListenerSocketRepo) {
    this.repository = repository;
  }

  async execute(
    channel: string,
    listener?: (...args: any[]) => void | undefined
  ) {
    try {
      this.repository.removeListener(channel, listener);
    } catch (e) {
      throw e;
    }
  }
}
