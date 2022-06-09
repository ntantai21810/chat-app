import AuthController from "./controller/Auth";
import ConversationController from "./controller/Conversation";
import MessageController from "./controller/Message";
import { ConversationPresenter, MessagePresenter } from "./presenter";
import AuthPresenter from "./presenter/Auth/authPresenter";

export const authController = new AuthController(new AuthPresenter());
export const conversationController = new ConversationController(
  new ConversationPresenter()
);
export const messageController = new MessageController(new MessagePresenter());
