import React, { useState } from "react";
import RSSSearch from "@/components/RSSSearch/index";
import { RSSSource } from "@/protos/taggy";
import SourcePage from '@/components/SourcePage/SourcePage';
import styles from "./index.module.css";

export default function Search(props : React.PropsWithChildren<any>) {
  
  const [RSSSource, setRSSSource] = useState<RSSSource>(); 
  
  
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
      <RSSSearch setRSSSource={setRSSSource}/>

      {RSSSource ? (
        <div className={styles.popup}>
          <div
            className={styles.blur}
            onClick={() => {
              setRSSSource(undefined);
            }}
          ></div>
          <div className={styles.channelPopUpboard}>
          <SourcePage source={RSSSource}></SourcePage>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
