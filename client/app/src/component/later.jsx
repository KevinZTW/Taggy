import React from "react";
import MarkdownView from "react-showdown";
import "../css/";

export default function Card(props) {
  return (
    <div>
      <div className="color"></div>
      <div className="title">{props.title}</div>
      <MarkdownView
        markdown={props.content}
        options={{ tables: true, emoji: true }}
        className="hihi"
      />
    </div>
  );
}
