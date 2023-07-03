import React, { useState } from "react";
import RSSSearch from "@/components/RSSSearch/index";
import { RSSFeed } from "@/protos/taggy";
import FeedPage from '@/components/FeedPage/FeedPage';
import styles from "./index.module.css";

export default function Search(props : React.PropsWithChildren<any>) {
  
  const [RSSFeed, setRSSFeed] = useState<RSSFeed>();
  
  
  const user = {
    uid:123
  }; "TODO: get user"

  return (
    <div className={styles.addRSSBoard}>
      <h1 className={styles.addTitle}>Add RSS source to subscribe</h1>

      <div className={styles.addSubTitle}>
        We support RSS link only
        {/* TODO: Support "Youtube channel/Medium profile page link "*/}
      </div>
      <RSSSearch setRSSFeed={setRSSFeed}/>

      {RSSFeed ? (
        <div className={styles.popup}>
          <div
            className={styles.blur}
            onClick={() => {
              setRSSFeed(undefined);
            }}
          ></div>
          <div className={styles.channelPopUpboard}>
          <FeedPage source={RSSFeed}></FeedPage>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
