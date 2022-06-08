export interface IAuthUseCase {
  login(phone: string, password: string): void;
  register(phone: string, fullName: string, password: string): void;
  loadAuth(): void;
}
