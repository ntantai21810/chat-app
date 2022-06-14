import { useEffect } from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { authController } from "./bootstrap";
import { store } from "./framework/redux/store";
import AuthProvider from "./views/components/common/AuthProvider";
import routes from "./views/routes";

function App() {
  useEffect(() => {
    authController.loadAuth();
  }, []);

  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
