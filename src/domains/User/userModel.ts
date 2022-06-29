export class UserModel {
  private _id: string = "";
  private fullName: string = "";
  private phone: string = "";
  private avatar?: string = "";
  // private lastOnlineTime: string = "";

  constructor(
    _id: string,
    fullName: string,
    phone: string,
    // lastOnlineTime: string,
    avatar: string = ""
  ) {
    this._id = _id;
    this.fullName = fullName;
    this.phone = phone;
    this.avatar = avatar;
    // this.lastOnlineTime = lastOnlineTime;
  }

  getId() {
    return this._id;
  }

  getFullName() {
    return this.fullName;
  }

  getPhone() {
    return this.phone;
  }

  getAvatar() {
    return this.avatar;
  }

  // getLastOnlineTime() {
  //   return this.lastOnlineTime;
  // }

  setFullName(fullName: string) {
    this.fullName = fullName;
  }

  setPhone(phone: string) {
    this.phone = phone;
  }

  setAvatar(avatar: string) {
    this.avatar = avatar;
  }

  // setLastOnlineTime(lastOnlineTime: string) {
  //   this.lastOnlineTime = lastOnlineTime;
  // }
}
