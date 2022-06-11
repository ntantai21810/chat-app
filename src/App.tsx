import React, { createContext, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Socket } from "socket.io-client";
import AuthProvider from "./views/components/common/AuthProvider";
import { store } from "./framework/redux/store";
import routes from "./views/routes";
import {
  authController,
  conversationController,
  messageController,
} from "./bootstrap";

export const SocketContext = createContext<{
  socket?: Socket;
  setSocket?: React.Dispatch<Socket>;
}>({});

function App() {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    authController.loadAuth();
    conversationController.connectDB();
    messageController.connectDB();
  }, []);

  return (
    <Provider store={store}>
      <SocketContext.Provider value={{ socket, setSocket }}>
        <Router>
          <Routes>
            {routes.map((route, index) => (
              <Route
                path={route.path}
                element={
                  route.private ? (
                    <AuthProvider>{route.layout(route.component)}</AuthProvider>
                  ) : (
                    route.layout(route.component)
                  )
                }
                key={index}
              />
            ))}
          </Routes>
        </Router>
      </SocketContext.Provider>
    </Provider>
  );
}

export default App;
