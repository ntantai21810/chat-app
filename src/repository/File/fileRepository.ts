import { IUploadImageRepo } from "../../useCases/File/uploadImageUseCase";

export interface IFileDataSource {
  uploadImages(images: string[]): Promise<string[]>;
}
export default class FileRepository implements IUploadImageRepo {
  private dataSource: IFileDataSource;

  constructor(dataSource: IFileDataSource) {
    this.dataSource = dataSource;
  }

  uploadImages(images: string[]): Promise<string[]> {
    return this.dataSource.uploadImages(images);
  }
}
