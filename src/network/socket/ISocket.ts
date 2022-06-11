export interface ISocket {
  connect(userId: string): void;
  listen(channel: string, callback: (data: any) => any): void;
}
