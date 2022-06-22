export interface IListenSocketRepo {
  listen(channel: string, callback: Function): void;
}

export default class ListenSocketUseCase {
  private repository: IListenSocketRepo;

  constructor(repository: IListenSocketRepo) {
    this.repository = repository;
  }

  async execute(channel: string, callback: Function) {
    this.repository.listen(channel, callback);
  }
}
