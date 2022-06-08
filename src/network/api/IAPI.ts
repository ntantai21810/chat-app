export interface IAPI {
  get(url: string, params: any): Promise<any>;
  post(url: string, data: any): Promise<any>;
  put(url: string, data: any): Promise<any>;
  delete(url: string, data: any): Promise<any>;
  setAccessToken(accessToken: string): void;
}
