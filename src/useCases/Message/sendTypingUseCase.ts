export interface ISendTypingRepo {
  sendTyping(toUserId: string, isTyping: boolean): void;
}

export default class SendTypingUseCase {
  private repository: ISendTypingRepo;

  constructor(repository: ISendTypingRepo) {
    this.repository = repository;
  }

  async execute(toUserId: string, isTyping: boolean) {
    this.repository.sendTyping(toUserId, isTyping);
  }
}
