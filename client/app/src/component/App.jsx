import "../css/App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Article from "./Article/Aritcle";
import AddArticle from "./AddArticle";

import Main from "./Main";
import FolderTab from "./FolderTab";
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/board">
            <header className="App-header">
              <AddArticle />
            </header>
            <div className="content">
              <FolderTab />
              <Main />
            </div>
          </Route>
          <Route path="/article" component={Article}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
