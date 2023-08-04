import styles from './NavigationTab.module.css';
import Tooltip from '@mui/material/Tooltip';
import logo from '@/public/imgs/taggy_logo_3x.png';

import { auth } from "@/utils/Friebase";
import Link from 'next/link'

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

// [Warning!] This part directly migrate from the old code, need to be refactored

export default function NavigationTab(props) {


  return (
    <div className={styles.functionTabWrapper}>
      <div className={styles.functionTab}>
        <div className={styles.logoWrapper}>
          <Link href={"/rss/latest"}>
            <Tooltip title="home" placement="right" arrow>
              <img src={logo.src} alt="" width="40px" />
            </Tooltip>
          </Link>
        </div>
        <div className={styles.iconWrapper}>
          <Link href={"/rss/latest"}>
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
          {/* <Link href={"/"}>
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
          <Link href={"/"}>
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
          </Link> */}
          {/* <Link href={"/group"}>
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
          </Link> */}
          {/* <Link href="/">
            <div className={styles.icon}>
              <SettingsIcon
                className={styles.Icon}
                calssname={styles.exit}
                fontSize="small"
                style={{ color: "#747474" }}
              />
            </div>
          </Link> */}
          <div>
            <Tooltip title="log out" placement="right" arrow>
              <div className={styles.icon}>
                <ExitToAppIcon
                  className={styles.Icon}
                  calssname={styles.exit}
                  fontSize="small"
                  style={{ color: "#747474" }}
                  onClick={() => {
                    auth.signOut();
                  }}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
