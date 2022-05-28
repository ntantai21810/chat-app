import React, { createContext, useState } from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Socket } from "socket.io-client";
import AuthProvider from "./components/common/AuthProvider";
import { persistor, store } from "./redux/store";
import routes from "./routes";

export const SocketContext = createContext<{
  socket?: Socket;
  setSocket?: React.Dispatch<Socket>;
}>({});

function App() {
  const [socket, setSocket] = useState<Socket>();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketContext.Provider value={{ socket, setSocket }}>
          <Router>
            <Routes>
              {routes.map((route, index) => (
                <Route
                  path={route.path}
                  element={
                    route.private ? (
                      <AuthProvider>
                        {route.layout(route.component)}
                      </AuthProvider>
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
      </PersistGate>
    </Provider>
  );
}

export default App;
