import { useEffect } from "react";
import { auth } from "./../firebase.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Article from "./Article/Aritcle";
import Header from "./Header/Header";
import Signup from "./Member/Signup";
import Signin from "./Member/Signin";
import Board from "./Board";
import MyRouter from "./MyRouter";
import FolderTab from "./SideTab/FolderTab";
import Graph from "./Graph1";
import RSSHeader from "./RSS/RSSHeader";
import RSSBoard from "./RSS/RSSBoard";

//React.Memo
//state prop dispatch history
function App() {
  return (
    <Router>
      <div className="App">
        <MyRouter />
        <Switch>
          <Route path="/signup" component={Signup}></Route>
          <Route path="/signin" component={Signin}></Route>
          <Route path="/board">
            <Header />
            <div className="content">
              <FolderTab />
              <Board />
            </div>
          </Route>
          <Route path="/article" component={Article}></Route>
          <Route path="/graph">
            <Header />
            <div className="content">
              <Board />
              <Graph />
            </div>
          </Route>
          <Route path="/findrss">
            <RSSHeader />
            <div className="content">
              <FolderTab />
              <RSSBoard />
            </div>
          </Route>
          <h1 className="title">Welcome to Taggy</h1>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
