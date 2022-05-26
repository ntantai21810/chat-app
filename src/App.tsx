import React, { createContext, useState } from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Socket } from "socket.io-client";
import EmptyLayout from "./layouts/Empty";
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
                    route.layout ? (
                      route.layout(route.component)
                    ) : (
                      <EmptyLayout>{route.component}</EmptyLayout>
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
