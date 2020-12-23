import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { db } from "../../firebase.js";
import RSSCard from "./RSSCard";
import { INITARTICLE } from "../../redux/actions";
import styles from "./RSSBoard.module.css";
import { app } from "../../lib/lib.js";
import RSSPage from "./RSSPage";
import { useLocation, useHistory } from "react-router-dom";
import "./RSSPage.css";
export default function Board(props) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [allFeeds, setAllFeeds] = useState([]);
  const [channelFeeds, setChannelFeeds] = useState({});
  const [lastVisible, setLastVisible] = useState(0);
  const [showPage, setShowPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");
  const [lastQueryDoc, setLastQueryDoc] = useState("");
  const location = useLocation();
  let search = location.search;
  let params = new URLSearchParams(search);
  let channelTitle = params.get("title");
  let channelDescription = params.get("description");
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  function batchFetchAllFeeds(channelRSSId, lastVisible) {
    console.log(channelRSSId);
    if (lastVisible === 0) {
      console.log("last visible equal zero!");
      db.collection("RSSItem")
        .where("RSSId", "==", channelRSSId)
        .orderBy("pubDate", "desc")
        .limit(15)
        .get()
        .then((snapshot) => {
          console.log("batchfetch start");
          let items = [...allFeeds];
          snapshot.forEach((doc) => {
            items.push(doc.data());
          });
          setLastQueryDoc(snapshot.docs[14]);

          setAllFeeds(items);
          console.log("se set items as ", items);
        });
    } else {
      if (lastQueryDoc) {
        console.log("else start, the last visible is", lastVisible);

        db.collection("RSSItem")
          .where("RSSId", "==", channelRSSId)
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
      return (
        <div className={styles.board}>
          <Link to="/home/channels" className={styles.arrowBack}>
            <ArrowBack style={{ color: "#FFFCEC" }} />
          </Link>
          <h1 className={styles.title}>{channelTitle} </h1>
          <div className={styles.channelDescription}>{channelDescription}</div>
          {isFollowed ? (
            <div className={styles.channelSubscribed}>Following</div>
          ) : (
            <div
              className={styles.channelSubscribe_btn}
              onClick={() => {
                console.log("add", props.channelId);
                app.addRSSToMember(user.uid, props.channelId, () => {
                  setIsFollowed(true);
                });
              }}
            >
              Follow
            </div>
          )}
          {feedList}
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
  const userRSSList = useSelector((state) => {
    return state.RSSReducer.UserRSSList;
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
    if (userRSSList) {
      if (userRSSList.includes(props.channelId)) {
        setIsFollowed(true);
      }
    }
  }, [userRSSList]);
  useEffect(() => {
    batchFetchAllFeeds(props.channelId, lastVisible);
  }, [props.channelId, lastVisible]);

  const feedPage = renderFeedPage(feedItem);
  let allFeedsOutome = renderAllFeeds(allFeeds);
  return (
    <div>
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
