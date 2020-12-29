import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RSSChannelList } from "./RSSBoard_Today_RSSList";
import { db } from "../../firebase.js";
import RSSCard from "./RSSCard";
import styles from "./RSSBoard.module.css";
import RSSPage from "./RSSPage";
import "./RSSPage.css";
export default function Board(props) {
  const [selectCategory, setSelectCategory] = useState("Front End");
  const [allFeeds, setAllFeeds] = useState([]);
  const [feedFetchTimes, setFeedFetchTimes] = useState(0);
  const [showPage, setShowPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");
  const [lastQueryDoc, setLastQueryDoc] = useState("");

  const FrontEndRSSList = [
    RSSChannelList.juejinFrontEndWeekHot.id,
    RSSChannelList.segmentfaultFrontEnd.id,
  ];
  const BackEndRSSList = ["o8y1c7B2TYtaNa2CHwLg"];
  const PMRSSList = ["cFG4OEd9QhF1DWOKDBRO", "uVlnTAMZMxQm7z1AYl3r"];
  const UIUXRSSList = ["EjzdgsJU72BvdxI1AY22"];
  const TechRSSList = ["EjzdgsJU72BvdxI1AY22"];

  useMemo(() => {
    setFeedFetchTimes(0);
    setAllFeeds([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectCategory]);

  useEffect(() => {
    switch (selectCategory) {
      case "Front End":
        batchFetchAllFeeds(FrontEndRSSList, feedFetchTimes);
        break;
      case "Back End":
        batchFetchAllFeeds(BackEndRSSList, feedFetchTimes);
        break;
      case "Product Managment":
        batchFetchAllFeeds(PMRSSList, feedFetchTimes);
        break;
      case "UI/UX":
        batchFetchAllFeeds(UIUXRSSList, feedFetchTimes);
        break;
      case "Tech News":
        batchFetchAllFeeds(TechRSSList, feedFetchTimes);
        break;
      default:
    }
  }, [selectCategory, feedFetchTimes]);
  function batchFetchAllFeeds(RSSList, feedFetchTimes) {
    if (feedFetchTimes === 0) {
      db.collection("RSSItem")
        .where("RSSId", "in", RSSList)
        .orderBy("pubDate", "desc")
        .limit(15)
        .get()
        .then((snapshot) => {
          const items = [...allFeeds];
          snapshot.forEach((doc) => {
            items.push(doc.data());
          });
          setLastQueryDoc(snapshot.docs[14]);
          setAllFeeds(items);
        });
    } else {
      if (lastQueryDoc) {
        db.collection("RSSItem")
          .where("RSSId", "in", RSSList)
          .orderBy("pubDate", "desc")
          .startAfter(lastQueryDoc)
          .limit(7)
          .get()
          .then((snapshot) => {
            const items = [...allFeeds];
            snapshot.forEach((doc) => {
              items.push(doc.data());
            });
            setLastQueryDoc(snapshot.docs[snapshot.docs.length - 1]);
            setAllFeeds(items);
          });
      }
    }
  }

  function renderAllFeeds(feedItems) {
    if (feedItems) {
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
      return feedList;
    } else {
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

  useEffect(() => {
    const handleScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;

      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (winScroll > height - 20) {
        const newLast = feedFetchTimes + 1;
        setFeedFetchTimes(newLast);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [feedFetchTimes]);

  const allFeedsOutome = renderAllFeeds(allFeeds);

  const feedPage = renderFeedPage(feedItem);
  return (
    <div className={styles.boardWrapper}>
      <div className={styles.board}>
        <h1 className={styles.title}>Today</h1>
        <div className={styles.description}>
          Trendy feeds from top blogs selected by Taggy
        </div>
        <div className={styles.switchWrapper}>
          <div
            className={
              selectCategory === "Front End"
                ? styles.switchTitleFocus
                : styles.switchTitle
            }
            onClick={() => {
              setSelectCategory("Front End");
            }}
          >
            <span>Front-End</span>
          </div>
          <div
            className={
              selectCategory === "Back End"
                ? styles.switchTitleFocus
                : styles.switchTitle
            }
            onClick={() => {
              setSelectCategory("Back End");
            }}
          >
            <span>Back-End</span>
          </div>
          <div
            className={
              selectCategory === "Product Managment"
                ? styles.switchTitleFocus
                : styles.switchTitle
            }
            onClick={() => {
              setSelectCategory("Product Managment");
            }}
          >
            <span>Product Managment</span>
          </div>
          <div
            className={
              selectCategory === "UI/UX"
                ? styles.switchTitleFocus
                : styles.switchTitle
            }
            onClick={() => {
              setSelectCategory("UI/UX");
            }}
          >
            <span>UI/UX</span>
          </div>
          <div
            className={
              selectCategory === "Tech News"
                ? styles.switchTitleFocus
                : styles.switchTitle
            }
            onClick={() => {
              setSelectCategory("Tech News");
            }}
          >
            <span>Tech News</span>
          </div>
        </div>

        {allFeedsOutome}
      </div>
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
