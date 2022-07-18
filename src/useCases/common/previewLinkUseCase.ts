import { AxiosRequestConfig } from "axios";
import { IMessageThumb } from "../../domains";

export interface IPreviewLinkRepo {
  previewLink(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<IMessageThumb>;
}

export class PreviewLinkUseCase {
  private repository: IPreviewLinkRepo;

  constructor(repository: IPreviewLinkRepo) {
    this.repository = repository;
  }

  async execute(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<IMessageThumb> {
    try {
      const res = await this.repository.previewLink(url, options);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
