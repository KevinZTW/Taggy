import styles from "./FunctionTab.module.css";
import logo from "../../img/taggy_logo_3x.png";
import { Link } from "react-router-dom";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import { auth } from "../../firebase.js";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import InboxIcon from "@material-ui/icons/Inbox";
import { useDispatch } from "react-redux";
import { SWITCHARTICLE, INITARTICLEFOLDERS } from "../../redux/actions";
export default function FunctionTab(props) {
  const dispatch = useDispatch();
  return (
    <div className={styles.functionTabWrapper}>
      <div className={styles.functionTab}>
        <div className={styles.logoWrapper}>
          <Link to={"/home"}>
            <img src={logo} alt="" width="40px" />
          </Link>
        </div>
        <div className={styles.iconWrapper}>
          <Link to={"/home"}>
            <HomeIcon
              style={
                props.focus === "home"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
          </Link>
          <Link to={"/board"}>
            <BookmarkBorderIcon
              onClick={() => {
                dispatch(SWITCHARTICLE("all"));
              }}
              fontSize="small"
              style={
                props.focus === "board"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
          </Link>
          <Link to={"/graph"}>
            <InsertChartIcon
              fontSize="small"
              style={
                props.focus === "graph"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
          </Link>
          <Link to={"/group"}>
            <PeopleAltIcon
              fontSize="small"
              style={
                props.focus === "group"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
          </Link>
          <Link to={"/signup"}>
            <AccountBoxIcon fontSize="medium" style={{ color: "#747474" }} />
          </Link>
        </div>
        <ExitToAppIcon
          calssname={styles.exit}
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
