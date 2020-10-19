import React from "react";
import LoginForm from "./components/LoginForm";
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={LoginForm} />
    </div>
  );
}

export default App;
