import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { CONSTANTS } from "../../helper";

export interface IAPI {
  get(url: string, params?: any, options?: AxiosRequestConfig): Promise<any>;
  post(url: string, data?: any, options?: any): Promise<any>;
  put(url: string, data?: any): Promise<any>;
  delete(url: string, params?: any): Promise<any>;
  setAccessToken(accessToken: string): void;
}

export class API implements IAPI {
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
      this.instance = new API(
        (process.env.REACT_APP_BASE_URL || "http://localhost:8000") + "/api"
      );
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

  async get(
    url: string,
    params?: any,
    options?: AxiosRequestConfig
  ): Promise<any> {
    try {
      return await this.axios.get(url, { params, ...options });
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  async post(url: string, data?: any, options?: any): Promise<any> {
    try {
      return await this.axios.post(url, data, options);
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  async put(url: string, data?: any): Promise<any> {
    try {
      return await this.axios.put(url, data);
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }
  async delete(url: string, params?: any): Promise<any> {
    try {
      return await this.axios.delete(url, { params });
    } catch (e) {
      throw e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;
    }
  }

  setAccessToken(accessToken: string): void {
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
}
