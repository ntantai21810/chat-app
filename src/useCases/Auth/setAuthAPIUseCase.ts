import { AuthModel } from "../../domains";

export interface ISetAuthAPIRepo {
  setAuth(authModel: AuthModel): void;
}

export class SetAuthAPIUseCase {
  private repository: ISetAuthAPIRepo;

  constructor(repository: ISetAuthAPIRepo) {
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
