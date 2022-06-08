import AuthController from "./controller/Auth";
import AuthPresenter from "./presenter/Auth/authPresenter";

export const authController = new AuthController(new AuthPresenter());
