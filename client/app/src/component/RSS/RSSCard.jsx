import React from "react";
import { Link } from "react-router-dom";
import styles from "./RSSCard.module.css";

export default function RSSCard(props) {
  var elem = document.createElement("div");
  elem.innerHTML = props.item.content;
  let src;
  if (elem.querySelector("img")) {
    src = elem.querySelector("img").src;
  }
  console.log(props.item);
  return (
    <div className={styles.container} onClick={props.onClick}>
      <div className={styles.card}>
        <div className={styles.color}>
          <img src={src} alt="" className={styles.img} />
        </div>

        <div className={styles.wordWrapper}>
          <div className={styles.title}>{props.item.title}</div>
          <div className={styles.creator}>{props.item.creator}</div>
          <div className={styles.content}>{props.item.contentSnippet}</div>
        </div>
      </div>
    </div>
  );
}
