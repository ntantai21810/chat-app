import { IFileDataSource } from "../../repository/File/fileRepository";

export interface IFileAPI {
  uploadImages(images: string[]): Promise<string[]>;
}

export default class FileDataSource implements IFileDataSource {
  private database: IFileAPI;

  constructor(database: IFileAPI) {
    this.database = database;
  }

  uploadImages(images: string[]): Promise<string[]> {
    return this.database.uploadImages(images);
  }
}
