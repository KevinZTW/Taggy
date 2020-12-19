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
import RSSBoardToday from "./RSS/RSSBoard_Today";
import RSSBoardExplore from "./RSS/RSSBoard_Explore";
import RSSExplore from "./RSS/RSSExplore";
import FunctionTab from "./SideTab/FunctionTab";
import MobileFunctionTab from "./SideTab/MobileFunctionTab";
//React.Memo
//state prop dispatch history
function App() {
  return (
    <Router>
      <div className="App">
        <MyRouter />
        <Switch>
          <Route exact path="/home">
            <div className="content">
              <FunctionTab focus="home" />
              <MobileFunctionTab focus="home" />
              <RSSTab focus="home" />
              <RSSBoardToday />
            </div>
          </Route>
          <Route path="/home/channels">
            <div className="content">
              <FunctionTab focus="home" />
              <MobileFunctionTab focus="channels" />
              <RSSTab focus="channels" />
              <RSSBoardExplore />
            </div>
          </Route>

          <Route path="/home/myfeeds">
            <div className="content">
              <FunctionTab focus="home" />
              <MobileFunctionTab focus="myfeeds" />
              <RSSTab focus="myfeeds" />
              <RSSBoard />
            </div>
          </Route>
          <Route path="/board">
            <div className="content">
              <FunctionTab focus="board" />
              <MobileFunctionTab focus="board" />
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
              <MobileFunctionTab focus="graph" />
              <GraphBoard />
              <Graph />
            </div>
          </Route>

          <Route path="/rssexplore">
            <div className="content">
              <FunctionTab />
              <MobileFunctionTab focus="home" />
              <RSSTab key="12223" />
              <RSSExplore />
            </div>
          </Route>
          <Route path="/signup" component={Signup}></Route>
          <Route path="/signin" component={Signin}></Route>
          <h1 className="title">Welcome to Taggy</h1>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
