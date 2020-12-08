import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { db } from "../../firebase.js";
import RSSCard from "./RSSCard";
import { INITARTICLE } from "../../redux/actions";
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
  const [lastQueryDoc, setLastQueryDoc] = useState("");
  const lastVisibleNumber = useRef(lastVisible);
  const dispatch = useDispatch();
  const userRSSList = useSelector((state) => {
    return state.RSSReducer.UserRSSList;
  });

  function batchFetchAllFeeds(userRSSList, lastVisible) {
    console.log(userRSSList);
    if (lastVisible === 0) {
      console.log("last visible equal zero!");
      db.collection("RSSItem")
        .orderBy("pubDate")
        .where("RSSId", "in", userRSSList)
        .limit(7)
        .get()
        .then((snapshot) => {
          console.log("batchfetch start");
          let items = [...allFeeds];
          snapshot.forEach((doc) => {
            items.push(doc.data());
          });
          setLastQueryDoc(snapshot.docs[6]);

          console.log("finsih loop");
          setAllFeeds(items);
          console.log("se set items as ", items);
        });
    } else {
      if (lastQueryDoc) {
        console.log("else start, the last visible is", lastVisible);
        console.log(lastQueryDoc);
        db.collection("RSSItem")
          .orderBy("pubDate")
          .startAfter(lastQueryDoc)
          .where("RSSId", "in", userRSSList)
          .limit(7)
          .get()
          .then((snapshot) => {
            let items = [...allFeeds];
            snapshot.forEach((doc) => {
              console.log(doc.data());
              items.push(doc.data());
            });
            setLastQueryDoc(snapshot.docs[6]);
            setAllFeeds(items);
          });
      }
    }
  }

  function renderAllFeeds(feedItems) {
    if (feedItems) {
      let feedList = [];
      for (let i in feedItems) {
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
          <h1 className={styles.title}>Your Daily Feeds</h1>
          <div className={styles.content}>Dont scroll fb! Lets read feeds~</div>
          {feedList}
        </div>
      );
    } else {
      return (
        <div className={styles.board}>
          <h1 className={styles.title}>Your Daily Feeds</h1>
          <div className={styles.content}>You dont have any feed</div>
          <div>You dont have any feed</div>
        </div>
      );
    }
  }

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

  const ChannelRSSId = useSelector((state) => {
    return state.RSSReducer.ChannelRSSId;
  });

  useEffect(() => {
    const handleScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;

      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (winScroll > height - 20) {
        console.log("reach the bottom!", lastVisible);

        let newLast = lastVisible + 7;
        setLastVisible(newLast);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastVisible]);

  useEffect(() => {
    console.log(lastVisible);
    if (userRSSList) {
      batchFetchAllFeeds(userRSSList, lastVisible);
    }
  }, [userRSSList, lastVisible]);
  useEffect(() => {
    fetchChannelFeed();
  }, [ChannelRSSId]);

  let allFeedsOutome;
  if (ChannelRSSId === "all") {
    console.log("channel id is all");
    console.log(allFeeds);
    allFeedsOutome = renderAllFeeds(allFeeds);
  } else if (ChannelRSSId) {
    allFeedsOutome = renderChannelFeeds();
  }

  async function fetchChannelFeed() {
    let items;
    let RSS;
    if (ChannelRSSId) {
      console.log(ChannelRSSId);
      RSS = await app.getRSSInfo(ChannelRSSId);
      items = await app.getChannelFeeds(ChannelRSSId);
      console.log(RSS, items);
      setChannelFeeds({
        RSS: RSS,
        items: items,
      });
    }
  }
  function renderChannelFeeds() {
    if (channelFeeds.items) {
      console.log(channelFeeds);
      let items = channelFeeds.items;
      let RSS = channelFeeds.RSS;
      let feedList = [];
      for (let i in items) {
        console.log(items[i]);
        feedList.push(
          <RSSCard
            item={items[i]}
            onClick={(e) => {
              console.log("hihi");
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
  console.log(lastVisible);
  console.log(allFeeds);
  return (
    <div
      className={styles.boardWrapper}
      onScroll={() => {
        alert("ewrwe");
        console.log("you scroll");
      }}
    >
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
