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
import GroupFolderTab from "./Group/GroupFolderTab";
import GroupBoard from "./Group/GroupBoard";
import Graph from "./Graph/Graph1";
import GraphBoard from "./Graph/GraphBoard";
import RSSHeader from "./RSS/RSSHeader";
import RSSTab from "./RSS/RSSTab";
import RSSBoard from "./RSS/RSSBoard";
import RSSExplore from "./RSS/RSSExplore";
import FunctionTab from "./SideTab/FunctionTab";
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
            <div className="content">
              <FunctionTab focus="board" />
              <FolderTab />
              <Board />
            </div>
          </Route>
          <Route path="/article" component={Article}></Route>
          <Route path="/group">
            <div className="content">
              <FunctionTab focus="group" />
              <GroupFolderTab />
              <GroupBoard />
            </div>
          </Route>
          <Route path="/graph">
            <div className="content">
              <FunctionTab focus="graph" />
              <GraphBoard />
              <Graph />
            </div>
          </Route>
          <Route path="/home">
            <div className="content">
              <FunctionTab focus="home" />
              <RSSTab key="123" />
              <RSSBoard />
            </div>
          </Route>
          <Route path="/rssexplore">
            <div className="content">
              <FunctionTab />
              <RSSTab key="12223" />
              <RSSExplore />
            </div>
          </Route>
          <h1 className="title">Welcome to Taggy</h1>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
