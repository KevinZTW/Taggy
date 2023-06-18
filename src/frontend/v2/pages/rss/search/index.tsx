import React, { useState } from "react";
import RSSSearch from "@/components/RSSSearch/index";

import FeedCard from "@/components/FeedCard";
import styles from "./index.module.css";

// import FeedPage from "./FeedPage";

import { popoverClasses } from "@mui/material";

export default function Search(props : React.PropsWithChildren<any>) {
  const [showPage, setShowPage] = useState(false);
  const [showChannelPage, setShowChannelPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");
  
  const user = {
    uid:123
  }; "TODO: get user"

//   function renderFeedPage(feedItem) {
//     return (
//       <FeedPage
//         item={feedItem}
//         onClick={() => {
//           setShowPage(false);
//         }}
//       />
//     );
//   }

  const searchFeed = {} //TODO:
  const searchFeedUrl = "" //TODO:

  function renderSearchFeed(feed) {
    const feedList = [];
    for (const i in feed.items) {
      feedList.push(
        <FeedCard
          item={feed.items[i]}
          onClick={(e) => {
            setShowPage(true);
            setFeedItem(feed.items[i]);
          }}
        />
      );
    }

    return (
      <div className={styles.channelPopUpboard}>
        <h1 className={styles.title}>{feed.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: feed.description }}></div>
        {feed.title ? (
          <button
            className={styles.channelSubscribe_btn}
            onClick={() => {
            //   subscribeRSS(user.uid, feed.title, searchFeedUrl, feed);
                alert("implement this")
            }}
          >
            Follow
          </button>
        ) : (
          ""
        )}
        {feedList}
      </div>
    );
  }

//   const feedPage = renderFeedPage(feedItem);
  const searchOutcome = renderSearchFeed(searchFeed);

  return (
    <div className={styles.addRSSBoard}>
      <h1 className={styles.addTitle}>Add RSS source to subscribe</h1>

      <div className={styles.addSubTitle}>
        We support RSS link & Youtube channel/Medium profile page link
      </div>
      <RSSSearch
        user={props.user}
        showChannel={() => {
          setShowChannelPage(true);
        }}
      />

      {showChannelPage ? (
        <div className={styles.popup}>
          <div
            className={styles.blur}
            onClick={() => {
              setShowChannelPage(false);
            }}
          ></div>
          {searchOutcome}
        </div>
      ) : (
        ""
      )}
      {/* {showPage ? (
        <div className={styles.popup}>
          <div
            className={styles.blur}
            onClick={() => {
              setShowPage(false);
            }}
          ></div>
          {feedPage}
        </div>
      ) : (
        ""
      )} */}
    </div>
  );
}
