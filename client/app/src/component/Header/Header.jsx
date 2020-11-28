import React from "react";
import { Link } from "react-router-dom";

import AddArticle from "../AddArticle";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
export default function Card(props) {
  return (
    <header className="App-header">
      <AddArticle className="headMemberIcon" />{" "}
      <Link to={"/signup"}>
        <AccountBoxIcon fontSize="large" style={{ color: "#FFFCEC" }} />
      </Link>
    </header>
  );
}
