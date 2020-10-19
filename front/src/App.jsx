import React from "react";
import LoginForm from "./components/LoginForm";
import { Route } from "react-router-dom";
import ChatRoom from "./components/ChatRoom";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={LoginForm} />
      <Route path="/room" component={ChatRoom} />
    </div>
  );
}

export default App;
