import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./Landing";
import Article from "./Article/Aritcle";
import Signup from "./Member/Signup";
import Signin from "./Member/Signin";
import Board from "./Board";
import MyRouter from "./MyRouter";
import FolderTab from "./SideTab/FolderTab";
import GroupFolderTab from "./Group/GroupFolderTab";
import GroupBoard from "./Group/GroupBoard";
import Graph from "./Graph/Graph";
import GraphBoard from "./Graph/GraphBoard";
import RSSTab from "./RSS/RSSTab";
import RSSSearch from "./RSS/RSSSearch";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RSSBoard from "./RSS/RSSBoard";
import RSSBoardToday from "./RSS/RSSBoard_Today";
import RSSBoardExplore from "./RSS/RSSBoard_Explore";
import RSSExplore from "./RSS/RSSExplore";
import FunctionTab from "./SideTab/FunctionTab";
import MobileFunctionTab from "./SideTab/MobileFunctionTab";
import MobileBurger from "./SideTab/Mobile_Burger";
//React.Memo
//state prop dispatch history
function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <MyRouter />
        <Switch>
          <Route exact path="/home">
            <div className="content">
              <FunctionTab focus="home" />
              <MobileFunctionTab focus="home" />
              <RSSTab focus="home" />
              <MobileBurger position="RSS" />
              <RSSBoardToday />
            </div>
          </Route>
          <Route path="/home/channels">
            <div className="content">
              <FunctionTab focus="home" />
              <MobileFunctionTab focus="channels" />
              <RSSTab focus="channels" />
              <MobileBurger position="RSS" />
              <RSSBoardExplore />
            </div>
          </Route>

          <Route path="/home/myfeeds">
            <div className="content">
              <FunctionTab focus="home" />
              <MobileFunctionTab focus="myfeeds" />
              <RSSTab focus="myfeeds" />
              <MobileBurger position="RSS" />
              <RSSBoard />
            </div>
          </Route>
          <Route path="/home/searchfeeds">
            <div className="content">
              <FunctionTab focus="home" />
              <MobileFunctionTab focus="myfeeds" />
              <RSSTab focus="searchfeeds" />
              <MobileBurger position="RSS" />
              <RSSSearch />
            </div>
          </Route>
          <Route path="/board">
            <div className="content">
              <FunctionTab focus="board" />
              <MobileFunctionTab focus="board" />
              <FolderTab />
              <MobileBurger position="board" />
              <Board />
            </div>
          </Route>
          <Route path="/article" component={Article}></Route>
          <Route path="/group">
            <div className="content">
              <FunctionTab focus="group" />
              <MobileFunctionTab focus="group" />
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
          <Route path="/" component={Landing}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
