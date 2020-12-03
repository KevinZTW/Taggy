import React from "react";
import { Link } from "react-router-dom";
import styles from "./RSSCard.module.css";

export default function RSSCard(props) {
  var elem = document.createElement("div");
  elem.innerHTML = props.item.content;
  let src = elem.querySelector("img").src;

  return (
    <div className={styles.container}>
      <Link to={`/article?id=${props.id}`}>
        <div className={styles.card}>
          <div className={styles.color}>
            <img src={src} alt="" className={styles.img} />
          </div>

          <div className={styles.wordWrapper}>
            <div className={styles.title}>{props.item.title}</div>
            <div>by{props.item.creator}</div>
            <div className={styles.content}>{props.item.contentSnippet}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
