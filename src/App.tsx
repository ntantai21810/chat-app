import React, { createContext, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Socket } from "socket.io-client";
import AuthProvider from "./components/common/AuthProvider";
import { connectDB } from "./configs/indexedDB";
import { persistor, store } from "./redux/store";
import routes from "./routes";

export const SocketContext = createContext<{
  socket?: Socket;
  setSocket?: React.Dispatch<Socket>;
}>({});

export const DBContext = createContext<IDBDatabase | null>(null);

function App() {
  const [socket, setSocket] = useState<Socket>();
  const [db, setDB] = useState<IDBDatabase | null>(null);

  const handleSuccessEvent = (event: Event) => {
    setDB((event.target as IDBOpenDBRequest).result);
  };

  const handleErrorEvent = (event: Event) => {
    console.log(event);
  };

  useEffect(() => {
    connectDB(handleSuccessEvent, handleErrorEvent);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketContext.Provider value={{ socket, setSocket }}>
          <DBContext.Provider value={db}>
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
          </DBContext.Provider>
        </SocketContext.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
