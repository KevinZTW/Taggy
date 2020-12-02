import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase.js";
import AddArticle from "../AddArticle";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import styles from "./Header.module.css";

export default function Card(props) {
  return (
    <header className={styles.header}>
      <AddArticle className="headMemberIcon" user={props.user} />

      <button
        class={styles.signOut}
        onClick={() => {
          auth
            .signOut()
            .then(() => console.log("user successfully sign out"))
            .catch((err) => {
              console.log(err);
            });
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
