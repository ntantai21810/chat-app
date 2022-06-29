import { IFile } from "../../domains";
import { IUploadFileRepo } from "../../useCases";

export interface IFileDataSource {
  uploadFiles(images: IFile[]): Promise<string[]>;
}
export class FileRepository implements IUploadFileRepo {
  private dataSource: IFileDataSource;

  constructor(dataSource: IFileDataSource) {
    this.dataSource = dataSource;
  }

  uploadFile(images: IFile[]): Promise<string[]> {
    return this.dataSource.uploadFiles(images);
  }
}
