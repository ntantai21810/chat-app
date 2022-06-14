import { AuthModel } from "../../domains/Auth";

export interface ISetAuthRepo {
  setAuth(authModel: AuthModel): void;
}

export default class SetAuthUseCase {
  private repository: ISetAuthRepo;

  constructor(repository: ISetAuthRepo) {
    this.repository = repository;
  }

  execute(authModel: AuthModel) {
    this.repository.setAuth(authModel);
  }
}
