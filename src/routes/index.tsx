import { ReactNode } from "react";
import MainLayout from "../layouts/Main";
import ChatPage from "../pages/Chat";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";

interface IRoute {
  path: string;
  component: ReactNode;
  layout?: (children: ReactNode) => ReactNode;
}

const routes: IRoute[] = [
  {
    path: "/",
    component: <LoginPage />,
  },
  {
    path: "/register",
    component: <RegisterPage />,
  },
  {
    path: "/chat",
    component: <ChatPage />,
    layout: (children: ReactNode) => <MainLayout>{children}</MainLayout>,
  },
];

export default routes;
