import React from "react";
import LoginForm from "./components/LoginForm";
import RoomComponent from "./components/RoomComponent";
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={LoginForm} />
      <Route path="/room" component={RoomComponent} />
    </div>
  );
}

export default App;
