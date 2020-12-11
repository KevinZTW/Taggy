import React from "react";
import { Link } from "react-router-dom";
import styles from "../css/Card.module.css";
import ShareIcon from "@material-ui/icons/Share";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteArticle } from "../firebase.js";
export default function Card(props) {
  var elem = document.createElement("div");

  elem.innerHTML = props.htmlContent;

  let src = elem.querySelector("img") ? elem.querySelector("img").src : null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Link to={`/article?id=${props.id}`} className={styles.color}>
          <div>
            <img src={src} alt="" className={styles.img} />
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
