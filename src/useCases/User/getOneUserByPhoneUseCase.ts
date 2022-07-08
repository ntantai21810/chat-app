import { UserModel } from "../../domains";

export interface IGetOneUserByPhoneRepo {
  getOneUserByPhone(phone: string): Promise<UserModel | null>;
}

export class GetOneUserByPhoneUseCase {
  private repository: IGetOneUserByPhoneRepo;

  constructor(repository: IGetOneUserByPhoneRepo) {
    this.repository = repository;
  }

  async execute(id: string) {
    try {
      const res = await this.repository.getOneUserByPhone(id);

      return res;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
