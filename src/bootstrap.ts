import AuthController from "./controller/Auth";
import ConversationController from "./controller/Conversation";
import DatabaseController from "./controller/Database";
import FriendController from "./controller/Friend";
import MessageController from "./controller/Message";
import SocketController from "./controller/Socket";
import UserController from "./controller/User";
import {
  ConversationPresenter,
  MessagePresenter,
  SocketPresenter,
} from "./presenter";
import AuthPresenter from "./presenter/Auth/authPresenter";
import DatabasePresenter from "./presenter/Database/databasePresenter";
import FriendPresenter from "./presenter/Friend/friendPresenter";

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
