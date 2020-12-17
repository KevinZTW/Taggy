import styles from "./MobileFunctionTab.module.css";
import logo from "../../img/taggy_logo_3x.png";
import { Link } from "react-router-dom";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import { auth } from "../../firebase.js";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import InboxIcon from "@material-ui/icons/Inbox";
import MenuIcon from "@material-ui/icons/Menu";
import ExploreIcon from "@material-ui/icons/Explore";
export default function FunctionTab(props) {
  return (
    <div className={styles.mobileFunctionTabWrapper}>
      <div className={styles.mobileFunctionTab}>
        <div className={styles.mobileIconWrapper}>
          <MenuIcon fontSize="large" style={{ color: "#747474" }} />
          <Link to={"/home"}>
            <HomeWorkIcon
              fontSize="large"
              style={
                props.focus === "home"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
          </Link>
          <Link to={"/home/explore"}>
            <ExploreIcon
              fontSize="large"
              style={
                props.focus === "graph"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
          </Link>
          <Link to={"/home/myfeeds"}>
            <RssFeedIcon
              fontSize="large"
              style={
                props.focus === "home"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
          </Link>
          <Link to={"/board"}>
            <InboxIcon
              fontSize="large"
              style={
                props.focus === "board"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
          </Link>

          <Link to={"/group"}>
            <PeopleAltIcon
              fontSize="large"
              style={
                props.focus === "group"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
