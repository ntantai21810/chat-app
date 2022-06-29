export interface IListenSocketRepo {
  listen(channel: string, callback: Function): void;
}

export class ListenSocketUseCase {
  private repository: IListenSocketRepo;

  constructor(repository: IListenSocketRepo) {
    this.repository = repository;
  }

  async execute(channel: string, callback: Function) {
    try {
      this.repository.listen(channel, callback);
    } catch (e) {
      throw e;
    }
  }
}
