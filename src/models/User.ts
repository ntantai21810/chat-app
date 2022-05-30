import { IBaseModel } from "./BaseModel";
export interface IUser extends IBaseModel {
  fullName: string;
  phone: string;
  avatar?: string;
}
