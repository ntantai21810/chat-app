import { IUser } from "./../../domains/User/IUser";
import UserAPIDataSource from "../../dataSource/User/userDataSouce";
import { normalizeUserData } from "../../domains/User/helper";
import API from "../../network/api/API";
import UserAPIRepository from "../../repository/User/userAPIRepository";
import GetUsersByPhoneUseCase from "../../useCases/User/getUserByPhoneUseCase";
import GetUseByIdUseCase from "../../useCases/User/getUserByIdUseCase";

export default class UserController {
  async getUserByPhone(phone: string) {
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
  }

  async getUserById(id: string) {
    const getUserByIdUseCase = new GetUseByIdUseCase(
      new UserAPIRepository(new UserAPIDataSource(API.getIntance()))
    );

    const res = await getUserByIdUseCase.execute(id);

    if (!res) return null;

    const user = normalizeUserData(res);

    return user;
  }
}
