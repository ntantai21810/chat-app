import { UserModel } from "../../domains/User";

export interface IGetUserByPhoneRepo {
  getUsersByPhone(phone: string): Promise<UserModel[]>;
}

export default class GetUsersByPhoneUseCase {
  private repository: IGetUserByPhoneRepo;

  constructor(repository: IGetUserByPhoneRepo) {
    this.repository = repository;
  }

  async execute(phone: string) {
    try {
      const res = await this.repository.getUsersByPhone(phone);

      return res;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
