import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../css/Card.module.css";
import placeholderImg from "../imgs/place_holder_img.png";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { app } from "../lib/lib.js";
import { RESETARTICLEFETCH } from "../redux/actions";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
export default function Card(props) {
  const dispatch = useDispatch();
  var elem = document.createElement("div");

  elem.innerHTML = props.htmlContent;
  let src;

  if (elem.querySelector("img") && props.link) {
    if (props.link.includes("segmentfault")) {
      src = elem.querySelector("img")
        ? // ? "https://segmentfault.com" +
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
  const CustomTooltip = withStyles((theme) => ({
    tooltip: {
      color: "white",
      fontFamily: "Open Sans",
      fontSize: 14,
    },
  }))(Tooltip);
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Link to={`/article?id=${props.id}`}>
          <div className={styles.imgWrapper}>
            {src ? (
              <div
                className={styles.color}
                style={{
                  backgroundImage: "url(" + src + ")",
                  backgroundRepeat: "no-repeat",
                  background: "cover",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              ></div>
            ) : (
              <img src={placeholderImg} alt="" />
            )}
          </div>
        </Link>
        <div className={styles.wordWrapper}>
          <div className={styles.titleWrapper}>
            <Link to={`/article?id=${props.id}`}>
              <div className={styles.title}>{props.title}</div>
            </Link>
            <div className={styles.actionContainer}>
              <Tooltip title="delete article" placement="right" arrow>
                <DeleteOutlineOutlinedIcon
                  style={{ fontSize: 20, color: "#5B5B5B" }}
                  className={styles.delete}
                  onClick={() => {
                    app.article.deleteArticle(props.id, () => {
                      dispatch(RESETARTICLEFETCH());
                    });
                  }}
                />
              </Tooltip>
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
