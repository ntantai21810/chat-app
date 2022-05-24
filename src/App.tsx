import React from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import EmptyLayout from "./layouts/Empty";
import { persistor, store } from "./redux/store";
import routes from "./routes";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
}

export default App;
