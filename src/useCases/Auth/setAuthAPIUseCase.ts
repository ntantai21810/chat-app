import { AuthModel } from "../../domains/Auth";

export interface ISetAuthAPIRepo {
  setAuth(authModel: AuthModel): void;
}

export default class SetAuthAPIUseCase {
  private repository: ISetAuthAPIRepo;

  constructor(repository: ISetAuthAPIRepo) {
    this.repository = repository;
  }

  execute(authModel: AuthModel) {
    this.repository.setAuth(authModel);
  }
}
