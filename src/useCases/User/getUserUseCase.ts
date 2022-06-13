import { UserModel } from "../../domains/User";
import { IUserPresenter } from "../../presenter";

export interface IGetUserRepo {
  getUser(id: string): Promise<UserModel | null>;
}

export default class GetUserUseCase {
  private repository: IGetUserRepo;
  private presenter: IUserPresenter;

  constructor(repository: IGetUserRepo, presenter?: IUserPresenter) {
    this.repository = repository;

    if (presenter) this.presenter = presenter;
  }

  async execute(id: string) {
    const userModel = await this.repository.getUser(id);

    return userModel;
  }
}
