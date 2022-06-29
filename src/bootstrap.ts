import {
  AuthController,
  ConversationController,
  MessageController,
  SocketController,
  DatabaseController,
  FriendController,
  UserController,
} from "./controller";
import {
  AuthPresenter,
  ConversationPresenter,
  MessagePresenter,
  SocketPresenter,
  DatabasePresenter,
  FriendPresenter,
} from "./presenter";

export const authController = new AuthController(new AuthPresenter());
export const conversationController = new ConversationController(
  new ConversationPresenter()
);
export const messageController = new MessageController(new MessagePresenter());
export const socketController = new SocketController(new SocketPresenter());
export const databaseController = new DatabaseController(
  new DatabasePresenter()
);
export const friendController = new FriendController(new FriendPresenter());
export const userController = new UserController();
