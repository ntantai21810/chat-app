import { UserModel } from "../../domains";

export interface IGetUserByIdRepo {
  getUserById(id: string): Promise<UserModel | null>;
}

export class GetUserByIdUseCase {
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
      throw e;
    }
  }
}
