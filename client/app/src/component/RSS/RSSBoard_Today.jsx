import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { db } from "../../firebase.js";
import RSSCard from "./RSSCard";
import { INITARTICLE } from "../../redux/actions";
import styles from "./RSSBoard.module.css";
import { app } from "../../lib/lib.js";
import RSSPage from "./RSSPage";
import "./RSSPage.css";
export default function Board(props) {
  const [selectCategory, setSelectCategory] = useState("Front End");
  const [allFeeds, setAllFeeds] = useState([]);
  const [lastVisible, setLastVisible] = useState(0);
  const [showPage, setShowPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");
  const [lastQueryDoc, setLastQueryDoc] = useState("");
  useMemo(() => {
    console.log("clean up the feeds!@");
    setLastVisible(0);
    setAllFeeds([]);
  }, [selectCategory]);
  const dispatch = useDispatch();
  const userRSSList = useSelector((state) => {
    return state.RSSReducer.UserRSSList;
  });
  console.log("reremder");
  console.log(allFeeds);
  function batchFetchAllFeeds(RSSList, lastVisible) {
    console.log(RSSList);
    if (lastVisible === 0) {
      console.log("last visible equal zero!");
      db.collection("RSSItem")
        .where("RSSId", "in", RSSList)
        .orderBy("pubDate", "desc")
        .limit(15)
        .get()
        .then((snapshot) => {
          console.log("batchfetch start");
          let items = [...allFeeds];
          console.log(items);
          snapshot.forEach((doc) => {
            console.log(doc.data());

            items.push(doc.data());
          });
          setLastQueryDoc(snapshot.docs[14]);

          console.log("finsih loop");
          setAllFeeds(items);
          console.log("se set items as ", items);
        });
    } else {
      if (lastQueryDoc) {
        console.log("else start, the last visible is", lastVisible);

        db.collection("RSSItem")
          .where("RSSId", "in", RSSList)
          .orderBy("pubDate", "desc")
          .startAfter(lastQueryDoc)
          .limit(7)
          .get()
          .then((snapshot) => {
            let items = [...allFeeds];
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
      return feedList;
    } else {
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
  const FrontEndRSSList = [
    "EjzdgsJU72BvdxI1AY22",
    "M6rvLDZkAAHN3WbgGZMi",
    "NOulYNIAsYlMHRLTsoRf",
    "NTFO9SHzN7727cvDwSJq",
  ];
  const BackEndRSSList = ["o8y1c7B2TYtaNa2CHwLg"];
  const PMRSSList = ["cFG4OEd9QhF1DWOKDBRO", "uVlnTAMZMxQm7z1AYl3r"];
  const UIUXRSSList = ["EjzdgsJU72BvdxI1AY22"];
  const TechRSSList = ["EjzdgsJU72BvdxI1AY22"];

  useEffect(() => {
    switch (selectCategory) {
      case "Front End":
        batchFetchAllFeeds(FrontEndRSSList, lastVisible);
        break;
      case "Back End":
        batchFetchAllFeeds(BackEndRSSList, lastVisible);
        break;
      case "Product Managment":
        batchFetchAllFeeds(PMRSSList, lastVisible);
        break;
      case "UI/UX":
        batchFetchAllFeeds(UIUXRSSList, lastVisible);
        break;
      case "Tech News":
        batchFetchAllFeeds(TechRSSList, lastVisible);
        break;
      default:
    }
  }, [selectCategory, lastVisible]);

  let allFeedsOutome;

  allFeedsOutome = renderAllFeeds(allFeeds);

  const feedPage = renderFeedPage(feedItem);
  return (
    <div className={styles.boardWrapper}>
      <div className={styles.board}>
        <h1 className={styles.title}>Today News</h1>
        <div className={styles.description}>
          The insights you need to keep ahead
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
            <span>Front End</span>
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
            <span>Back End</span>
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
