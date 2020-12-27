import styles from "./FunctionTab.module.css";
import Tooltip from "@material-ui/core/Tooltip";
import logo from "../../img/taggy_logo_3x.png";
import { Link } from "react-router-dom";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import { auth } from "../../firebase.js";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
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
            <Tooltip title="home" placement="right" arrow>
              <img src={logo} alt="" width="40px" />
            </Tooltip>
          </Link>
        </div>
        <div className={styles.iconWrapper}>
          <Link to={"/home"}>
            <Tooltip title="home" placement="right" arrow>
              <div className={styles.icon}>
                <HomeOutlinedIcon
                  className={styles.Icon}
                  style={
                    props.focus === "home"
                      ? { color: "#2074ec" }
                      : { color: "rgba(255,255,255,0.4)" }
                  }
                />
              </div>
            </Tooltip>
          </Link>
          <Link to={"/board"}>
            <Tooltip title="board" placement="right" arrow>
              <div className={styles.icon}>
                <BookmarkBorderIcon
                  className={styles.Icon}
                  onClick={() => {
                    dispatch(SWITCHARTICLE("all"));
                  }}
                  fontSize="small"
                  style={
                    props.focus === "board"
                      ? { color: "#2074ec" }
                      : { color: "rgba(255,255,255,0.4)" }
                  }
                />
              </div>
            </Tooltip>
          </Link>
          <Link to={"/graph"}>
            <Tooltip title="graph" placement="right" arrow>
              <div className={styles.icon}>
                <AssessmentOutlinedIcon
                  className={styles.Icon}
                  fontSize="small"
                  style={
                    props.focus === "graph"
                      ? { color: "#2074ec" }
                      : { color: "rgba(255,255,255,0.4)" }
                  }
                />
              </div>
            </Tooltip>
          </Link>
          <Link to={"/group"}>
            <Tooltip title="group" placement="right" arrow>
              <div className={styles.icon}>
                <PeopleAltOutlinedIcon
                  fontSize="small"
                  className={styles.Icon}
                  style={
                    props.focus === "group"
                      ? { color: "#2074ec" }
                      : { color: "rgba(255,255,255,0.4)" }
                  }
                />
              </div>
            </Tooltip>
          </Link>
          <Link to={"/"}>
            <Tooltip title="log out" placement="right" arrow>
              <div className={styles.icon}>
                <ExitToAppIcon
                  className={styles.Icon}
                  calssname={styles.exit}
                  fontSize="small"
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
            </Tooltip>
          </Link>
        </div>
      </div>
    </div>
  );
}
