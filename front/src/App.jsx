import React from "react";
import { Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import RoomListPage from "./components/RoomListPage";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={MainPage} />
      <Route exact path="/room" component={RoomListPage} />
    </div>
  );
}

export default App;
