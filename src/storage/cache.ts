interface IMemCache {
  [key: string]: any[];
}

export interface ICache {
  get(): Promise<any>;
  getByKey(key: string): Promise<any>;
  add(key: string, data: any): void;
  update(key: string, data: any): void;
  delete(key: string, data: any): void;
}

const memCache: IMemCache = {};

export class CacheStorage implements ICache {
  private static instace: CacheStorage;

  public static getInstance() {
    if (!this.instace) this.instace = new CacheStorage();

    return this.instace;
  }

  get(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(memCache);
    });
  }

  getByKey(key: string) {
    return new Promise((resolve, reject) => {
      if (memCache[key]) {
        resolve(memCache[key]);
      } else {
        resolve([]);
      }
    });
  }

  add(key: string, data: any): void {
    if (memCache[key]) {
      memCache[key].push(data);

      memCache[key] = memCache[key].slice(-20);
    } else {
      memCache[key] = [data];
    }
  }

  update(key: string, data: any): void {
    if (memCache[key]) {
      memCache[key] = memCache[key].map((m) => (m.id !== data.id ? m : data));
    }
  }

  delete(key: string, data: any): void {
    if (memCache[key]) {
      memCache[key] = memCache[key].filter((item) => item.id !== data.id);
    }
  }
}
