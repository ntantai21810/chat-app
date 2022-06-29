import { UserAPIDataSource } from "../../dataSource";
import { IUser, normalizeUserData } from "../../domains";
import { API } from "../../network";
import { UserAPIRepository } from "../../repository";
import { GetUseByIdUseCase, GetUsersByPhoneUseCase } from "../../useCases";

export class UserController {
  async getUserByPhone(phone: string) {
    try {
      const getUserByPhoneUseCase = new GetUsersByPhoneUseCase(
        new UserAPIRepository(new UserAPIDataSource(API.getIntance()))
      );

      const res = await getUserByPhoneUseCase.execute(phone);

      const users: IUser[] = [];

      for (let userModel of res) {
        const user = normalizeUserData(userModel);
        users.push(user);
      }

      return users;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getUserById(id: string) {
    try {
      const getUserByIdUseCase = new GetUseByIdUseCase(
        new UserAPIRepository(new UserAPIDataSource(API.getIntance()))
      );

      const res = await getUserByIdUseCase.execute(id);

      if (!res) return null;

      const user = normalizeUserData(res);

      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
