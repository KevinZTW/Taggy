import React from "react";
import MarkdownView from "react-showdown";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../css/Card.css";

export default function Card(props) {
  console.log(props.id);
  return (
    <div className="card">
      <Link to={`/article?id=${props.id}`}>
        <div className="color"></div>
        <div className="title">{props.title}</div>
        <div className="content">{props.content}</div>
      </Link>
    </div>
  );
}
