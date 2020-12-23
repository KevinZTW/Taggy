import styles from "./MobileFunctionTab.module.css";
import logo from "../../img/taggy_logo_3x.png";
import { Link } from "react-router-dom";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import HomeIcon from "@material-ui/icons/Home";
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
          <Link to={"/home"}>
            <HomeIcon
              fontSize="small"
              style={
                props.focus === "home"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
            <div className={styles.title}>Home</div>
          </Link>
          <Link to={"/home/channels"}>
            <ExploreIcon
              fontSize="small"
              style={
                props.focus === "channels"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
            <div className={styles.title}>Channels</div>
          </Link>
          <Link to={"/home/myfeeds"}>
            <RssFeedIcon
              fontSize="small"
              style={
                props.focus === "myfeeds"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
            <div className={styles.title}>Feeds</div>
          </Link>
          <Link to={"/board"}>
            <InboxIcon
              fontSize="small"
              style={
                props.focus === "board"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
            <div className={styles.title}>Board</div>
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
            <div className={styles.title}>Group</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
