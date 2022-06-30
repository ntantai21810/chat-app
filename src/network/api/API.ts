import axios, { AxiosInstance } from "axios";
import { IAuthAPI, IFileAPI, IMessageAPI, IUserAPI } from "../../dataSource";
import { IAuth, IFile, IMessage, IUser } from "../../domains";
import { CONSTANTS } from "../../helper";

export class API implements IAuthAPI, IUserAPI, IFileAPI, IMessageAPI {
  private static instance: API;

  private axios: AxiosInstance;

  private constructor(baseURL: string) {
    this.axios = axios.create({ baseURL: baseURL });

    this.axios.interceptors.response.use(
      function (response) {
        return response.data;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  public static getIntance() {
    if (!this.instance) {
      this.instance = new API("http://localhost:8000/api");
    }

    return this.instance;
  }

  public setAccessTokenInterceptor(accessToken: string) {
    this.axios.interceptors.request.use(
      (config) => {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async login(phone: string, password: string): Promise<IAuth> {
    try {
      return await this.axios.post("/login", { phone, password });
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  async register(
    phone: string,
    fullName: string,
    password: string
  ): Promise<IAuth> {
    try {
      return await this.axios.post("/register", { phone, fullName, password });
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      return await this.axios.get(`/users/${id}`);
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  async getUserByPhone(phone: string): Promise<IUser[]> {
    try {
      return await this.axios.get(`/users`, { params: { phone } });
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  async uploadFiles(images: IFile[]): Promise<string[]> {
    try {
      return await this.axios.post(`/upload`, images);
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  async getPendingMessages(): Promise<IMessage[]> {
    try {
      return await this.axios.get(`/messages/pending`);
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  async deletePendingMessages(ids: string[]) {
    try {
      await this.axios.put(`/messages/pending/delete`, ids);
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }
}
