import styles from "./FunctionTab.module.css";
import Tooltip from "@material-ui/core/Tooltip";
import logo from "../../imgs/taggy_logo_3x.png";
import { Link } from "react-router-dom";

import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import { auth } from "../../firebase.js";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

import { withStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { SWITCHARTICLE } from "../../redux/actions";
export default function FunctionTab(props) {
  const dispatch = useDispatch();
  const CustomTooltip = withStyles((theme) => ({
    tooltip: {
      color: "white",
      fontFamily: "Open Sans",
      fontSize: 14,
    },
  }))(Tooltip);
  return (
    <div className={styles.functionTabWrapper}>
      <div className={styles.functionTab}>
        <div className={styles.logoWrapper}>
          <Link to={"/home"}>
            <CustomTooltip title="home" placement="right" arrow>
              <img src={logo} alt="" width="40px" />
            </CustomTooltip>
          </Link>
        </div>
        <div className={styles.iconWrapper}>
          <Link to={"/home"}>
            <CustomTooltip title="home" placement="right" arrow>
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
            </CustomTooltip>
          </Link>
          <Link to={"/board"}>
            <CustomTooltip title="board" placement="right" arrow>
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
            </CustomTooltip>
          </Link>
          <Link to={"/graph"}>
            <CustomTooltip title="graph" placement="right" arrow>
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
            </CustomTooltip>
          </Link>
          {/* <Link to={"/group"}>
            <CustomTooltip title="group" placement="right" arrow>
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
            </CustomTooltip>
          </Link> */}
          <Link to={"/"}>
            <CustomTooltip title="log out" placement="right" arrow>
              <div className={styles.icon}>
                <ExitToAppIcon
                  className={styles.Icon}
                  calssname={styles.exit}
                  fontSize="small"
                  style={{ color: "#747474" }}
                  onClick={() => {
                    auth
                      .signOut()

                      .catch((err) => {});
                  }}
                />
              </div>
            </CustomTooltip>
          </Link>
        </div>
      </div>
    </div>
  );
}
