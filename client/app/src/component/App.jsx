import "../css/App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Article from "./Article/Aritcle";
import Header from "./Header/Header";
import Signup from "./Member/Signup";
import Signin from "./Member/Signin";
import Board from "./Board";
import FolderTab from "./FolderTab";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/board">
            {" "}
            <Header />
            <div className="content">
              <FolderTab />
              <Board />
            </div>
          </Route>
          <Route path="/article" component={Article}></Route>
          <Route path="/signup" component={Signup}></Route>
          <Route path="/signin" component={Signin}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
