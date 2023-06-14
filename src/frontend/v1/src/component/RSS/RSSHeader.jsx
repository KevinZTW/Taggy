import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase.js";

import AccountBoxIcon from "@material-ui/icons/AccountBox";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import styles from "./RSSHeader.module.css";

export default function RSSHeader(props) {
  return (
    <header className={styles.header}>
      <button
        class={styles.signOut}
        onClick={() => {
          auth.signOut();
        }}
      >
        Sign out
      </button>
      <Link to={"/board"}>
        <HomeWorkIcon fontSize="large" style={{ color: "#FFFCEC" }} />
      </Link>
      <Link to={"/graph"}>
        <InsertChartIcon fontSize="large" style={{ color: "#FFFCEC" }} />
      </Link>
      <Link to={"/signup"}>
        <AccountBoxIcon fontSize="large" style={{ color: "#FFFCEC" }} />
      </Link>
    </header>
  );
}
