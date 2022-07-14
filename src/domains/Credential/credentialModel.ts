export class CredentialModel {
  private phone: string = "";
  private fullName: string | undefined;
  private password: string = "";
  private avatar: FileList | undefined;

  constructor(
    phone: string,
    password: string,
    fullName?: string,
    avatar?: FileList
  ) {
    this.phone = phone;
    this.password = password;
    this.fullName = fullName;
    this.avatar = avatar;
  }

  getPhone() {
    return this.phone;
  }

  getFullName() {
    return this.fullName;
  }

  getPassword() {
    return this.password;
  }

  getAvatar() {
    return this.avatar;
  }

  setPhone(phone: string) {
    this.phone = phone;
  }

  setFullName(fullName: string) {
    this.fullName = fullName;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setAvatar(avatar: FileList) {
    this.avatar = avatar;
  }
}
