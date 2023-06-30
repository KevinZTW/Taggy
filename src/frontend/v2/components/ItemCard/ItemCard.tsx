import { RSSItem } from "@/protos/taggy";
import Highlighter from "react-highlight-words";
import React, { useEffect, useState, useRef } from "react";
import styles from "./ItemCard.module.css";
import placeholderImg from "@/public/imgs/place_holder_img.png";
import Link from "next/link";

export default function ItemCard({item, highLight}:{item:RSSItem}){
  // return (
  //   <>
  //   <div>{item.title}</div>
  //   <div>{item.description}</div>
  //   <div>{item.content}</div>
  //   </>
  // )

  const [image, setImage] = useState(false);
  const backgroundSrc = useRef();

  useEffect(() => {
    var elem = document.createElement("div");
    elem.innerHTML = item.content;
    const imgSrc = elem.querySelector("img");
    if (imgSrc) {
      backgroundSrc.current = imgSrc.src;
    } else if (item.media) {
      backgroundSrc.current =
        item.media[0]["media:thumbnail"][0]["$"]["url"];
    }
    const image = new Image();
    image.src = backgroundSrc.current;
    image.onload = () => {
      setImage(true);
    };
  }, []);

  const passDay = (Date.now() - item.pubDate) / (1000 * 60 * 60 * 24);

  const showDay =
    passDay < 1 ? Math.floor(passDay * 24) + "h" : Math.floor(passDay) + "d";

  return (
    <Link href={`/rss/items/${item.id}`}>
      <div className={styles.container} >
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
              <img src={placeholderImg.src} alt="" />
            )}
          </div>

          <div className={styles.wordWrapper}>
            <div className={styles.title}>
              {highLight ? (
                <Highlighter
                  textToHighlight={item.title}
                  searchWords={[highLight]}
                />
              ) : (
                item.title
              )}
            </div>
            <div className={styles.creator}>
              {item.RSS} / {showDay}
            </div>
            <div className={styles.content}>
              {highLight ? (
                <Highlighter
                  textToHighlight={item.contentSnippet}
                  searchWords={[highLight]}
                />
              ) : (
                item.description
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}