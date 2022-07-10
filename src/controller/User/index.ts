import { UserAPIDataSource } from "../../dataSource";
import { IUser, normalizeUserData } from "../../domains";
import { API } from "../../network";
import { UserAPIRepository } from "../../repository";
import {
  GetOneUserByPhoneUseCase,
  GetUserByIdUseCase,
  GetUsersByPhoneUseCase,
} from "../../useCases";

export class UserController {
  async getUsersByPhone(phone: string) {
    try {
      const getUsersByPhoneUseCase = new GetUsersByPhoneUseCase(
        new UserAPIRepository(new UserAPIDataSource(API.getIntance()))
      );

      const res = await getUsersByPhoneUseCase.execute(phone);

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
      const getUserByIdUseCase = new GetUserByIdUseCase(
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

  async getOneUserByPhone(phone: string) {
    try {
      const getOneUserByPhoneUseCase = new GetOneUserByPhoneUseCase(
        new UserAPIRepository(new UserAPIDataSource(API.getIntance()))
      );

      const res = await getOneUserByPhoneUseCase.execute(phone);

      if (!res) return null;

      const user = normalizeUserData(res);

      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
