export interface ISendSocketRepo {
  send(channel: string, data: any): void;
}

export default class SendSocketUseCase {
  private repository: ISendSocketRepo;

  constructor(repository: ISendSocketRepo) {
    this.repository = repository;
  }

  async execute(channel: string, data: any) {
    try {
      this.repository.send(channel, data);
    } catch (e) {
      console.log(e);
    }
  }
}
