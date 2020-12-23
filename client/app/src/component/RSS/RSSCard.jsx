import React from "react";
import { Link } from "react-router-dom";
import styles from "./RSSCard.module.css";
import { db } from "../../firebase.js";

export default function RSSCard(props) {
  console.log(props.item);
  function deleteRSS(RSSID) {
    db.collection("RSSItem")
      .where("RSSId", "==", RSSID)
      .get()
      .then((snapShot) => {
        snapShot.forEach((item) => {
          console.log(item.data());
          item.ref.delete();
        });
      });
  }

  // deleteRSS("TgCy1JeefV4chebgB7JD");
  var elem = document.createElement("div");
  elem.innerHTML = props.item.content;
  let src;
  if (elem.querySelector("img")) {
    src = elem.querySelector("img").src;
  } else if (props.item.media) {
    src = props.item.media[0]["media:thumbnail"][0]["$"]["url"];
  }
  let passDay = (Date.now() - props.item.pubDate) / (1000 * 60 * 60 * 24);
  let showDay =
    passDay < 1 ? Math.floor(passDay * 24) + "h" : Math.floor(passDay) + "d";
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
          <div className={styles.creator}>
            {props.item.RSS} / {showDay}
          </div>
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
