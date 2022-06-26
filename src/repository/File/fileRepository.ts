import { IFile } from "./../../domains/common/helper";
import { IUploadFileRepo } from "../../useCases/File/uploadFileUseCase";

export interface IFileDataSource {
  uploadFiles(images: IFile[]): Promise<string[]>;
}
export default class FileRepository implements IUploadFileRepo {
  private dataSource: IFileDataSource;

  constructor(dataSource: IFileDataSource) {
    this.dataSource = dataSource;
  }

  uploadFile(images: IFile[]): Promise<string[]> {
    return this.dataSource.uploadFiles(images);
  }
}
