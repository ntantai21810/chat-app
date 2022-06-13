import AuthController from "./controller/Auth";
import ConversationController from "./controller/Conversation";
import MessageController from "./controller/Message";
import SocketController from "./controller/Socket";
import UserController from "./controller/User";
import {
  ConversationPresenter,
  MessagePresenter,
  SocketPresenter,
  UserPresenter,
} from "./presenter";
import AuthPresenter from "./presenter/Auth/authPresenter";

export const authController = new AuthController(new AuthPresenter());
export const conversationController = new ConversationController(
  new ConversationPresenter()
);
export const messageController = new MessageController(new MessagePresenter());
export const userController = new UserController(new UserPresenter());
export const socketController = new SocketController(new SocketPresenter());
