import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { db } from "../../firebase.js";
import RSSCard from "./RSSCard";
import styles from "./RSSBoard.module.css";
import { app } from "../../lib/lib.js";
import RSSPage from "./RSSPage";
import "./RSSPage.css";
export default function Board(props) {
  const [allFeeds, setAllFeeds] = useState([]);
  const [channelFeeds, setChannelFeeds] = useState({});
  const [lastVisible, setLastVisible] = useState(0);
  const [showPage, setShowPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");
  const [lastQueryDoc0, setLastQueryDoc0] = useState("");
  const [queryPaging, setQueryPaging] = useState(0);

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  function fetchUserFeeds(userUid, paging) {
    fetch(
      `http://localhost:3000/route/rss/userfeeds?uid=${userUid}&paging=${paging}`
    ).then((res) => {
      if (res.status !== 200) {
        console.log("sth wrong..", res);
      } else {
        res.json().then((data) => {
          console.log(data);
          setAllFeeds([...allFeeds].concat(data.feeds));
        });
      }
    });
  }
  function batchFetchAllFeeds(userRSSList, lastVisible) {
    //console.log(userRSSList);
    if (lastVisible === 0 && userRSSList[0]) {
      //console.log("last visible equal zero!");
      db.collection("RSSItem")
        .orderBy("pubDate", "desc")
        .where("RSSId", "in", userRSSList.slice(0, 10))
        .limit(7)
        .get()
        .then((snapshot) => {
          const items = [...allFeeds];
          snapshot.forEach((doc) => {
            //console.log(doc.data());

            items.push(doc.data());
          });
          setLastQueryDoc0(snapshot.docs[snapshot.docs.length - 1]);
          setAllFeeds(items);
          //console.log("se set items as ", items);
        });
    } else {
      if (lastQueryDoc0 && userRSSList[0]) {
        //console.log("else start, the last visible is", lastVisible);

        db.collection("RSSItem")
          .orderBy("pubDate", "desc")
          .where("RSSId", "in", userRSSList.slice(0, 9))
          .startAfter(lastQueryDoc0)
          .limit(7)
          .get()
          .then((snapshot) => {
            const items = [...allFeeds];
            snapshot.forEach((doc) => {
              items.push(doc.data());
            });

            setLastQueryDoc0(snapshot.docs[snapshot.docs.length - 1]);
            setAllFeeds(items);
          });
      }
    }
  }

  function renderAllFeeds(feedItems) {
    if (feedItems) {
      console.log(feedItems);
      const feedList = [];
      for (const i in feedItems) {
        feedList.push(
          <RSSCard
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
    console.log(user);
    if (user) {
      fetchUserFeeds(user.uid, queryPaging);
    }
  }, [user, queryPaging]);
  useEffect(() => {
    fetchChannelFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ChannelRSSId]);

  let allFeedsOutome;
  if (ChannelRSSId === "all") {
    //console.log("channel id is all");
    //console.log(allFeeds);
    allFeedsOutome = renderAllFeeds(allFeeds);
  } else if (ChannelRSSId) {
    allFeedsOutome = renderChannelFeeds();
  }

  async function fetchChannelFeed() {
    let items;
    let RSS;
    if (ChannelRSSId) {
      //console.log(ChannelRSSId);
      RSS = await app.getRSSInfo(ChannelRSSId);
      items = await app.getChannelFeeds(ChannelRSSId);
      //console.log(RSS, items);
      setChannelFeeds({
        RSS: RSS,
        items: items,
      });
    }
  }
  function renderChannelFeeds() {
    if (channelFeeds.items) {
      //console.log(channelFeeds);
      const items = channelFeeds.items;
      const RSS = channelFeeds.RSS;
      const feedList = [];
      for (const i in items) {
        //console.log(items[i]);
        feedList.push(
          <RSSCard
            key={items[i].id}
            item={items[i]}
            onClick={(e) => {
              //console.log("hihi");
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
