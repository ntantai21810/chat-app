import { ReactNode } from "react";
import EmptyLayout from "../layouts/Empty";
import MainLayout from "../layouts/Main";
import ChatPage from "../pages/Chat";
import LoginPage from "../pages/Login";
import MainPage from "../pages/Main";
import RegisterPage from "../pages/Register";

interface IRoute {
  path: string;
  component: ReactNode;
  layout: (children: ReactNode) => ReactNode;
  private: boolean;
}

const routes: IRoute[] = [
  {
    path: "/",
    component: <MainPage />,
    layout: (children: ReactNode) => <EmptyLayout>{children}</EmptyLayout>,
    private: false,
  },
  {
    path: "/login",
    component: <LoginPage />,
    layout: (children: ReactNode) => <EmptyLayout>{children}</EmptyLayout>,
    private: false,
  },
  {
    path: "/register",
    component: <RegisterPage />,
    layout: (children: ReactNode) => <EmptyLayout>{children}</EmptyLayout>,
    private: false,
  },
  {
    path: "/chat",
    component: <ChatPage />,
    layout: (children: ReactNode) => <MainLayout>{children}</MainLayout>,
    private: true,
  },
];

export default routes;
