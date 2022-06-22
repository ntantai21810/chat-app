import { AuthModel } from "../../domains/Auth";

export interface ISetAuthStorageRepo {
  setAuth(authModel: AuthModel): void;
}

export default class SetAuthStorageUseCase {
  private repository: ISetAuthStorageRepo;

  constructor(repository: ISetAuthStorageRepo) {
    this.repository = repository;
  }

  execute(authModel: AuthModel) {
    this.repository.setAuth(authModel);
  }
}
