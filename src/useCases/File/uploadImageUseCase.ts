export interface IUploadImageRepo {
  uploadImages(images: string[]): Promise<string[]>;
}

export default class UploadImageUseCase {
  private repository: IUploadImageRepo;

  constructor(repository: IUploadImageRepo) {
    this.repository = repository;
  }

  async execute(images: string[]) {
    try {
      const imageUrls = await this.repository.uploadImages(images);

      return imageUrls;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
