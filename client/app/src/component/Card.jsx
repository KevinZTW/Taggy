import React from "react";
import { Link } from "react-router-dom";
import styles from "../css/Card.module.css";
import { deleteArticle } from "../firebase.js";
export default function Card(props) {
  var elem = document.createElement("div");
  console.log(props.htmlContent);
  elem.innerHTML = props.htmlContent;
  console.log(elem.querySelector("img"));
  let src = elem.querySelector("img") ? elem.querySelector("img").src : null;
  console.log(src);
  return (
    <div className={styles.container}>
      <button
        className={styles.delete}
        onClick={() => {
          deleteArticle(props.id);
        }}
      >
        x
      </button>
      <Link to={`/article?id=${props.id}`}>
        <div className={styles.card}>
          <div className={styles.color}>
            <img src={src} alt="" className={styles.img} />
          </div>
          <div className={styles.wordWrapper}>
            <div className={styles.title}>{props.title}</div>

            <div className={styles.content}>{props.content}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
