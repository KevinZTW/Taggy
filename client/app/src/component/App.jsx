import "../css/App.css";
import { useEffect, useState } from "react";
import { auth } from "./../firebase.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import Article from "./Article/Aritcle";
import Header from "./Header/Header";
import Signup from "./Member/Signup";
import Signin from "./Member/Signin";
import Board from "./Board";
import FolderTab from "./FolderTab";

function App() {
  let [user, setUser] = useState("");
  const history = useHistory();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("In APP email is", user.email);
        setUser(user);
      } else {
        history.push("/signup");
      }
    });
  }, []);
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/signup" component={Signup}></Route>
          <Route path="/signin" component={Signin}></Route>
          <Route path="/board">
            <Header user={user} />
            <div className="content">
              <FolderTab />
              <Board user={user} />
            </div>
          </Route>
          <Route path="/article" user={user} component={Article}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
