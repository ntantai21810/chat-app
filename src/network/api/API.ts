import axios, { AxiosInstance } from "axios";
import { CONSTANTS } from "../../helper/constants";
import { IAPI } from "./IAPI";

export default class API implements IAPI {
  private static instance: API;

  private axios: AxiosInstance;
  private accessToken: string;

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

  public setAccessToken(accessToken: string) {
    this.accessToken = accessToken;

    this.axios.interceptors.request.use(
      (config) => {
        if (config.headers && this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public async execute(
    url: string,
    method: "get" | "post" | "put" | "delete",
    params: any,
    data: any
  ) {
    try {
      const res = await this.axios({
        url,
        method,
        params,
        data,
      });

      return res;
    } catch (e) {
      const errorMessage =
        e.response?.data?.error?.message || CONSTANTS.SERVER_ERROR;

      throw errorMessage;
    }
  }

  public get(url: string, params: any) {
    return this.execute(url, "get", params, {});
  }

  public post(url: string, data: any) {
    return this.execute(url, "post", {}, data);
  }

  public put(url: string, data: any) {
    return this.execute(url, "put", {}, data);
  }

  public delete(url: string, data: any) {
    return this.execute(url, "delete", {}, data);
  }
}
