export class UserModel {
  private id: string = "";
  private fullName: string = "";
  private phone: string = "";
  private avatar?: string = "";

  constructor(
    id: string,
    fullName: string,
    phone: string,
    avatar: string = ""
  ) {
    this.id = id;
    this.fullName = fullName;
    this.phone = phone;
    this.avatar = avatar;
  }

  getId() {
    return this.id;
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

  setFullName(fullName: string) {
    this.fullName = fullName;
  }

  setPhone(phone: string) {
    this.phone = phone;
  }

  setAvatar(avatar: string) {
    this.avatar = avatar;
  }
}
