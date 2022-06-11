export default class CredentialModel {
  private phone: string = "";
  private fullName: string | undefined;
  private password: string = "";

  constructor(phone: string, password: string, fullName?: string) {
    this.phone = phone;
    this.password = password;
    this.fullName = fullName;
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

  setPhone(phone: string) {
    this.phone = phone;
  }

  setFullName(fullName: string) {
    this.fullName = fullName;
  }

  setPassword(password: string) {
    this.password = password;
  }
}
