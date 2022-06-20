import { UserModel } from "../../domains/User";

export interface IGetUserByIdRepo {
  getUserById(id: string): Promise<UserModel | null>;
}

export default class GetUseByIdUseCase {
  private repository: IGetUserByIdRepo;

  constructor(repository: IGetUserByIdRepo) {
    this.repository = repository;
  }

  async execute(id: string) {
    try {
      const res = await this.repository.getUserById(id);

      return res;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
