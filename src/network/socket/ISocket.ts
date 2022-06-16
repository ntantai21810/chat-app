export interface ISocket {
  connect(userId: string, accessToken: string): void;
  listen(channel: string, callback: (data: any) => any): void;
  send(channel: string, data: any): void;
  removeAllListen(channel: string): void;
  disconnect(): void;
}
