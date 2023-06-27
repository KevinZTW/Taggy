import { RSSFeed } from "@/protos/taggy";
import Highlighter from "react-highlight-words";
import React, { useEffect, useState, useRef } from "react";
import styles from "./FeedCard.module.css";
import placeholderImg from "@/public/imgs/place_holder_img.png";
import Link from "next/link";

export default function FeedCard({feed, highLight}:{feed:RSSFeed}){
  // return (
  //   <>
  //   <div>{feed.title}</div>
  //   <div>{feed.description}</div>
  //   <div>{feed.content}</div>
  //   </>
  // )

  const [image, setImage] = useState(false);
  const backgroundSrc = useRef();

  useEffect(() => {
    var elem = document.createElement("div");
    elem.innerHTML = feed.content;
    const imgSrc = elem.querySelector("img");
    if (imgSrc) {
      backgroundSrc.current = imgSrc.src;
    } else if (feed.media) {
      backgroundSrc.current =
        feed.media[0]["media:thumbnail"][0]["$"]["url"];
    }
    const image = new Image();
    image.src = backgroundSrc.current;
    image.onload = () => {
      setImage(true);
    };
  }, []);

  const passDay = (Date.now() - feed.pubDate) / (1000 * 60 * 60 * 24);

  const showDay =
    passDay < 1 ? Math.floor(passDay * 24) + "h" : Math.floor(passDay) + "d";

  return (
    <Link href={`/feed/${feed.id}`}>
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
                  textToHighlight={feed.title}
                  searchWords={[highLight]}
                />
              ) : (
                feed.title
              )}
            </div>
            <div className={styles.creator}>
              {feed.RSS} / {showDay}
            </div>
            <div className={styles.content}>
              {highLight ? (
                <Highlighter
                  textToHighlight={feed.contentSnippet}
                  searchWords={[highLight]}
                />
              ) : (
                feed.description
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}