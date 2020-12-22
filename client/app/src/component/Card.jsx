import React from "react";
import { Link } from "react-router-dom";
import styles from "../css/Card.module.css";
import ShareIcon from "@material-ui/icons/Share";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteArticle } from "../firebase.js";
export default function Card(props) {
  var elem = document.createElement("div");
  console.log(props.link);
  elem.innerHTML = props.htmlContent;
  let src;

  if (elem.querySelector("img") && props.link) {
    console.log(elem.querySelector("img").getAttribute("data-src"));

    if (props.link.includes("segmentfault")) {
      src = elem.querySelector("img")
        ? "https://segmentfault.com" +
          elem.querySelector("img").getAttribute("data-src")
        : null;
    } else if (
      props.link.includes("codertw") ||
      props.link.includes("juejin")
    ) {
      src = elem.querySelector("img")
        ? elem.querySelector("img").getAttribute("data-src")
        : null;
    } else {
      src = elem.querySelector("img") ? elem.querySelector("img").src : null;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Link to={`/article?id=${props.id}`}>
          <div className={styles.imgWrapper}>
            <div className={styles.color}>
              <img src={src} alt="" className={styles.img} />
            </div>
          </div>
        </Link>
        <div className={styles.wordWrapper}>
          <div className={styles.title}>
            <Link to={`/article?id=${props.id}`}>{props.title}</Link>
            <div className={styles.actionContainer}>
              <ShareIcon style={{ fontSize: 20, color: "#5B5B5B" }} />
              <DeleteIcon
                style={{ fontSize: 20, color: "#5B5B5B" }}
                className={styles.delete}
                onClick={() => {
                  deleteArticle(props.id);
                }}
              />
            </div>
          </div>
          <Link to={`/article?id=${props.id}`}>
            <div className={styles.content}>{props.content}</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
