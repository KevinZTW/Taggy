import styles from "./FunctionTab.module.css";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import { auth } from "../../firebase.js";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RssFeedIcon from "@material-ui/icons/RssFeed";
export default function FunctionTab() {
  return (
    <div className={styles.functionTabWrapper}>
      <div className={styles.functionTab}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt="" width="50px" />
        </div>
        <div className={styles.iconWrapper}>
          <Link to={"/board"}>
            <HomeWorkIcon fontSize="large" style={{ color: "#747474" }} />
          </Link>
          <Link to={"/rss"}>
            <RssFeedIcon fontSize="large" style={{ color: "#747474" }} />
          </Link>
          <Link to={"/graph"}>
            <InsertChartIcon fontSize="large" style={{ color: "#747474" }} />
          </Link>
          <Link to={"/signup"}>
            <AccountBoxIcon fontSize="large" style={{ color: "#747474" }} />
          </Link>
        </div>
        <ExitToAppIcon
          calssName={styles.exit}
          style={{ color: "#747474" }}
          onClick={() => {
            auth
              .signOut()
              .then(() => console.log("user successfully sign out"))
              .catch((err) => {
                console.log(err);
              });
          }}
        />
      </div>
    </div>
  );
}
