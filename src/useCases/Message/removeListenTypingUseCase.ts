import { SOCKET_CONSTANTS } from "../../helper/constants";

export interface IRemoveListenTypingRepo {
  removeListenTyping(channel: string): void;
}

export default class RemoveListenTypingUseCase {
  private repository: IRemoveListenTypingRepo;

  constructor(repository: IRemoveListenTypingRepo) {
    this.repository = repository;
  }

  async execute() {
    this.repository.removeListenTyping(SOCKET_CONSTANTS.TYPING);
  }
}
