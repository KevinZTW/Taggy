import React, { useEffect, useState, useRef } from "react";

import styles from "./RSSCard.module.css";
import Highlighter from "react-highlight-words";
import placeholderImg from "../../imgs/place_holder_img.png";
export default function RSSCard(props) {
  const [image, setImage] = useState(false);
  const backgroundSrc = useRef();

  useEffect(() => {
    var elem = document.createElement("div");
    elem.innerHTML = props.item.content;
    const imgSrc = elem.querySelector("img");
    if (imgSrc) {
      backgroundSrc.current = imgSrc.src;
      console.log(backgroundSrc.current);
    } else if (props.item.media) {
      backgroundSrc.current =
        props.item.media[0]["media:thumbnail"][0]["$"]["url"];
    }
    const image = new Image();
    image.src = backgroundSrc.current;
    image.onload = () => {
      setImage(true);
    };
  }, []);

  const passDay = (Date.now() - props.item.pubDate) / (1000 * 60 * 60 * 24);

  const showDay =
    passDay < 1 ? Math.floor(passDay * 24) + "h" : Math.floor(passDay) + "d";

  return (
    <div className={styles.container} onClick={props.onClick}>
      <div className={styles.card}>
        <div className={styles.imgWrapper}>
          {image ? (
            <div
              className={styles.color}
              style={{
                backgroundImage: "url(" + backgroundSrc.current + ")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>
          ) : (
            <img src={placeholderImg} alt="" />
          )}
        </div>

        <div className={styles.wordWrapper}>
          <div className={styles.title}>
            {props.highLight ? (
              <Highlighter
                textToHighlight={props.item.title}
                searchWords={[props.highLight]}
              />
            ) : (
              props.item.title
            )}
          </div>
          <div className={styles.creator}>
            {props.item.RSS} / {showDay}
          </div>
          <div className={styles.content}>
            {props.highLight ? (
              <Highlighter
                textToHighlight={props.item.contentSnippet}
                searchWords={[props.highLight]}
              />
            ) : (
              props.item.contentSnippet ||
              props.item["content:encodedSnippet"] ||
              props.item.media[0]["media:description"][0]
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
