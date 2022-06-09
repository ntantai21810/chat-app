export interface IMessageUseCase {
  connect(): void;
  getMessages(myId: string, otherId: string): void;
}
