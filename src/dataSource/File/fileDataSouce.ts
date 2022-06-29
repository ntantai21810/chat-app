import { IFile } from "../../domains";
import { IFileDataSource } from "../../repository";

export interface IFileAPI {
  uploadFiles(images: IFile[]): Promise<string[]>;
}

export class FileDataSource implements IFileDataSource {
  private database: IFileAPI;

  constructor(database: IFileAPI) {
    this.database = database;
  }

  uploadFiles(images: IFile[]): Promise<string[]> {
    return this.database.uploadFiles(images);
  }
}
