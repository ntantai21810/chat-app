export interface IStorage {
  get(key: string): any;
  set(key: string, data: any): void;
  remove(key: string): void;
}

export class LocalStorage implements IStorage {
  private static instance: LocalStorage;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new LocalStorage();
    }

    return this.instance;
  }

  get(key: string) {
    return localStorage.getItem(key);
  }

  set(key: string, data: any): void {
    localStorage.setItem(key, data);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
