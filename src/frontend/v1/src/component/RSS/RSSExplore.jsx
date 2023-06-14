import React, { useState } from "react";
import { useSelector } from "react-redux";
import FindRSS from "./FindRSS";
import RSSCard from "./RSSCard";
import styles from "./RSSBoard.module.css";
import { app } from "../../lib/lib.js";
import RSSPage from "./RSSPage";

export default function Board(props) {
  const [showPage, setShowPage] = useState(false);
  const [showChannelPage, setShowChannelPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  function renderFeedPage(feedItem) {
    return (
      <RSSPage
        item={feedItem}
        onClick={() => {
          setShowPage(false);
        }}
      />
    );
  }

  const searchFeed = useSelector((state) => {
    return state.RSSReducer.feed;
  });
  const searchFeedUrl = useSelector((state) => {
    return state.RSSReducer.url;
  });

  function renderSearchFeed(feed) {
    const feedList = [];
    for (const i in feed.items) {
      feedList.push(
        <RSSCard
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
              app.subscribeRSS(user.uid, feed.title, searchFeedUrl, feed);
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

  const feedPage = renderFeedPage(feedItem);
  const searchOutcome = renderSearchFeed(searchFeed);

  return (
    <div className={styles.addRSSBoard}>
      <h1 className={styles.addTitle}>Add RSS source to subscribe</h1>

      <div className={styles.addSubTitle}>
        We support RSS link & Youtube channel/Medium profile page link
      </div>
      <FindRSS
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
      {showPage ? (
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
      )}
    </div>
  );
}
