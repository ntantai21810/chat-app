import { IFile } from "../../domains";

export interface IUploadFileRepo {
  uploadFile(images: IFile[]): Promise<string[]>;
}

export class UploadFileUseCase {
  private repository: IUploadFileRepo;

  constructor(repository: IUploadFileRepo) {
    this.repository = repository;
  }

  async execute(images: IFile[]) {
    try {
      const imageUrls = await this.repository.uploadFile(images);

      return imageUrls;
    } catch (e) {
      console.log(e);
      throw "Upload error";
    }
  }
}
