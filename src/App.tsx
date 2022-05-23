import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import EmptyLayout from "./layouts/Empty";
import routes from "./routes";

function App() {
  return (
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
  );
}

export default App;
