import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { db } from "../../firebase.js";
import RSSCard from "./RSSCard";
import { INITARTICLE } from "../../redux/actions";
import styles from "./RSSBoard.module.css";
import { app } from "../../lib.js";
import RSSPage from "./RSSPage";
export default function Board(props) {
  const [showPage, setShowPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");
  const [channelFeed, setChannelFeed] = useState("");
  const dispatch = useDispatch();
  console.log("rerender");
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  function renderFeedPage(feedItem) {
    console.log("redner run again");
    console.log(feedItem);
    return <RSSPage item={feedItem} />;
  }

  const ChannelRSSId = useSelector((state) => {
    console.log("hihi");
    return state.RSSReducer.ChannelRSSId;
  });
  console.log("rerender channelid is ", ChannelRSSId);

  async function renderChannelFeed() {
    let items;
    let RSS;

    if (ChannelRSSId) {
      console.log(ChannelRSSId);
      RSS = await app.getRSSInfo(ChannelRSSId);
      items = await app.getChannelFeeds(ChannelRSSId);

      console.log(RSS, items);
      let feedList = [<div>nono</div>];
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

  const searchFeed = useSelector((state) => {
    return state.RSSReducer.feed;
  });
  const searchFeedUrl = useSelector((state) => {
    return state.RSSReducer.url;
  });

  function renderSearchFeed(feed) {
    let feedList = [];
    for (let i in feed.items) {
      feedList.push(
        <RSSCard
          item={feed.items[i]}
          onClick={(e) => {
            console.log("hihi");
            setShowPage(true);
            setFeedItem(feed.items[i]);
          }}
        />
      );
    }

    return (
      <div className={styles.board}>
        <h1 className={styles.title}>{feed.title}</h1>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: feed.description }}
        ></div>
        {feed.title ? (
          <button
            className={styles.subscribe_btn}
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
  //   useEffect(() => {

  //     if (searchFeed) {
  //       checkArticleUpdate(user.uid);
  //     }
  //   }, [user]);
  const feedPage = renderFeedPage(feedItem);
  const searchOutcome = renderSearchFeed(searchFeed);
  useEffect(() => {
    renderChannelFeed().then((ChannelFeedOutcome) => {
      setChannelFeed(ChannelFeedOutcome);
    });
  }, [ChannelRSSId]);

  useEffect(() => {
    function checkArticleUpdate(uid) {
      db.collection("Articles")
        .where("uid", "==", uid)
        .onSnapshot(function (querySnapshot) {
          let list = [];
          querySnapshot.forEach(function (doc) {
            list.push({
              title: doc.data().title,
              content: doc.data().markDown.slice(0, 100),
              id: doc.data().id,
              tags: doc.data().tags,
            });
          });
          dispatch(INITARTICLE(list));
        });
    }
    if (user) {
      checkArticleUpdate(user.uid);
    }
  }, [user]);
  return (
    <div>
      {channelFeed}
      {searchOutcome}
      {showPage ? (
        <div className={styles.popup}>
          <button
            onClick={() => {
              setShowPage(false);
            }}
          >
            Close Page
          </button>
          {feedPage}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
