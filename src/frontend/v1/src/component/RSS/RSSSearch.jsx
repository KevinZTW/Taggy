import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SearchRSS from "./SearchRSS";

import RSSCard from "./RSSCard";
import styles from "./RSSBoard.module.css";

import RSSPage from "./RSSPage";

export default function Board(props) {
  const [showPage, setShowPage] = useState(false);
  const [showChannelPage, setShowChannelPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");

  function renderFeedPage(feedItem) {
    return (
      <RSSPage
        highLight={searchFeed.title}
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

  function renderSearchFeed(feed) {
    const feedList = [];
    for (const i in feed.items) {
      feedList.push(
        <RSSCard
          highLight={feed.title}
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
        <div className={styles.titleWrapper}>
          <SearchIcon
            fontSize="large"
            color="white"
            style={{ color: "white" }}
          />
          <h1 className={styles.title}>{feed.title}</h1>
        </div>

        {feedList}
      </div>
    );
  }

  const feedPage = renderFeedPage(feedItem);
  const searchOutcome = renderSearchFeed(searchFeed);

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.board}>
        <h1 className={styles.title}>Search Article</h1>

        <div className={styles.description}>Search quality resources</div>
        <SearchRSS
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
    </div>
  );
}
