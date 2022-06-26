import { IFile } from "./../../domains/common/helper";
import { IFileDataSource } from "../../repository/File/fileRepository";

export interface IFileAPI {
  uploadFiles(images: IFile[]): Promise<string[]>;
}

export default class FileDataSource implements IFileDataSource {
  private database: IFileAPI;

  constructor(database: IFileAPI) {
    this.database = database;
  }

  uploadFiles(images: IFile[]): Promise<string[]> {
    return this.database.uploadFiles(images);
  }
}
