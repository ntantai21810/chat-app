import { IFile } from "../../domains";
import { IAPI } from "../../network";
import { IFileDataSource } from "../../repository";

export class FileDataSource implements IFileDataSource {
  private database: IAPI;

  constructor(database: IAPI) {
    this.database = database;
  }

  uploadFiles(images: IFile[]): Promise<string[]> {
    return this.database.post("/upload", images);
  }
}
