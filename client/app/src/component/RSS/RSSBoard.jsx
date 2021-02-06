import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import RSSCard from "./RSSCard";
import styles from "./RSSBoard.module.css";
import { app } from "../../lib/lib.js";
import RSSPage from "./RSSPage";
import "./RSSPage.css";
export default function Board(props) {
  const [allFeeds, setAllFeeds] = useState([]);
  const [channelFeeds, setChannelFeeds] = useState({});
  const [showPage, setShowPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");
  const [queryPaging, setQueryPaging] = useState(0);

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  function fetchUserFeeds(userUid, paging) {
    fetch(
      `https://www.shopcard.site/route/rss/userfeeds?uid=${userUid}&paging=${paging}`
    )
      .then((res) => {
        if (res.status !== 200) {
        } else {
          res.json().then((data) => {
            setAllFeeds([...allFeeds].concat(data.feeds));
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function renderAllFeeds(feedItems) {
    if (feedItems) {
      const feedList = [];
      for (const i in feedItems) {
        feedList.push(
          <RSSCard
            key={feedItems[i].FeedId}
            item={feedItems[i]}
            onClick={(e) => {
              setShowPage(true);
              setFeedItem(feedItems[i]);
            }}
          />
        );
      }
      return (
        <div className={styles.board}>
          <h1 className={styles.title}>My Feeds</h1>
          <div className={styles.description}>
            Feeds from your subscribed RSS
          </div>
          {feedList}
        </div>
      );
    } else {
      return (
        <div className={styles.board}>
          <h1 className={styles.title}>Subscribed Feeds</h1>
          <div className={styles.content}>You dont have any feed yet!</div>
        </div>
      );
    }
  }

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

  const ChannelRSSId = useSelector((state) => {
    return state.RSSReducer.ChannelRSSId;
  });

  useEffect(() => {
    const handleScroll = () => {
      app.util.handleScroll(queryPaging, setQueryPaging);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [queryPaging]);

  useEffect(() => {
    if (user) {
      fetchUserFeeds(user.uid, queryPaging);
    }
  }, [user, queryPaging]);
  useEffect(() => {
    async function fetchChannelFeed() {
      let items;
      let RSS;
      if (ChannelRSSId) {
        RSS = await app.getRSSInfo(ChannelRSSId);
        items = await app.getChannelFeeds(ChannelRSSId);

        setChannelFeeds({
          RSS: RSS,
          items: items,
        });
      }
    }
    fetchChannelFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ChannelRSSId]);

  const allFeedsOutome =
    ChannelRSSId === "all" ? renderAllFeeds(allFeeds) : renderChannelFeeds();

  function renderChannelFeeds() {
    if (channelFeeds.items) {
      const items = channelFeeds.items;
      const RSS = channelFeeds.RSS;
      const feedList = [];
      for (const i in items) {
        feedList.push(
          <RSSCard
            key={items[i].id}
            item={items[i]}
            onClick={(e) => {
              setShowPage(true);
              setFeedItem(items[i]);
            }}
          />
        );
      }
      return (
        <div className={styles.board}>
          <h1 className={styles.title}>{RSS.title}</h1>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: RSS.description }}
          ></div>
          {feedList}
        </div>
      );
    }
  }
  const feedPage = renderFeedPage(feedItem);
  return (
    <div className={styles.boardWrapper}>
      {allFeedsOutome}
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
