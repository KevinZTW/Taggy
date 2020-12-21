import React from "react";
import { Link } from "react-router-dom";
import styles from "./RSSCard.module.css";

export default function RSSCard(props) {
  var elem = document.createElement("div");
  elem.innerHTML = props.item.content;
  let src;
  if (elem.querySelector("img")) {
    src = elem.querySelector("img").src;
  } else if (props.item.media) {
    src = props.item.media[0]["media:thumbnail"][0]["$"]["url"];
  }
  return (
    <div className={styles.container} onClick={props.onClick}>
      <div className={styles.card}>
        <div className={styles.imgWrapper}>
          <div className={styles.color}>
            <img src={src} alt="" className={styles.img} />
          </div>
        </div>

        <div className={styles.wordWrapper}>
          <div className={styles.title}>{props.item.title}</div>
          <div className={styles.creator}>{props.item.creator}</div>
          <div className={styles.content}>
            {props.item.contentSnippet ||
              props.item["content:encodedSnippet"] ||
              props.item.media[0]["media:description"][0]}
          </div>
        </div>
      </div>
    </div>
  );
}
