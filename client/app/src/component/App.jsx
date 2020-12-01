import "../css/App.css";
import { useEffect } from "react";
import { auth } from "./../firebase.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Article from "./Article/Aritcle";
import Header from "./Header/Header";
import Signup from "./Member/Signup";
import Signin from "./Member/Signin";
import Board from "./Board";
import MyRouter from "./MyRouter";
import FolderTab from "./FolderTab";
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
          <h1 className="title">Welcome to Taggy</h1>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
