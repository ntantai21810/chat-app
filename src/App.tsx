import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./routes";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route path={route.path} element={<route.component />} key={index} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
