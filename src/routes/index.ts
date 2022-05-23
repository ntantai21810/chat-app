import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";

const routes = [
  {
    path: "/",
    component: LoginPage,
  },
  {
    path: "/register",
    component: RegisterPage,
  },
];

export default routes;
