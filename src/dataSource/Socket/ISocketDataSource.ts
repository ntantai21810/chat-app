export interface ISocketDataSource {
  connect(userId: string, accessToken: string): void;
}
