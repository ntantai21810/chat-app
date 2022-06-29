import { AuthModel } from "../../domains";

export interface ISetAuthStorageRepo {
  setAuth(authModel: AuthModel): void;
}

export class SetAuthStorageUseCase {
  private repository: ISetAuthStorageRepo;

  constructor(repository: ISetAuthStorageRepo) {
    this.repository = repository;
  }

  execute(authModel: AuthModel) {
    try {
      this.repository.setAuth(authModel);
    } catch (e) {
      throw e;
    }
  }
}
