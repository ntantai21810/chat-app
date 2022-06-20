import axios, { AxiosInstance } from "axios";
import { IAuthAPI } from "../../dataSource";
import { IUserAPI } from "../../dataSource/User";
import { IAuth } from "../../domains/Auth";
import { IUser } from "../../domains/User";
import { CONSTANTS } from "../../helper/constants";

export default class API implements IAuthAPI, IUserAPI {
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
        if (config.headers && accessToken) {
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
      console.log(e);

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
      console.log(e);

      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      return await this.axios.get(`/users/${id}`);
    } catch (e) {
      console.log(e);

      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  async getUserByPhone(phone: string): Promise<IUser[]> {
    try {
      return await this.axios.get(`/users`, { params: { phone } });
    } catch (e) {
      console.log(e);

      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }
}
