import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchRSS from "./SearchRSS";
import { db } from "../../firebase.js";
import RSSCard from "./RSSCard";
import { INITARTICLE } from "../../redux/actions";
import styles from "./RSSBoard.module.css";
import { app } from "../../lib/lib.js";
import RSSPage from "./RSSPage";

import youtube from "../../img/youtube_logo.png";

export default function Board(props) {
  const [showPage, setShowPage] = useState(false);
  const [showChannelPage, setShowChannelPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");
  const dispatch = useDispatch();
  console.log("rerender");
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  function renderFeedPage(feedItem) {
    console.log("redner run again");
    console.log(feedItem);
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
    console.log("hihi");
    return state.RSSReducer.ChannelRSSId;
  });
  console.log("rerender channelid is ", ChannelRSSId);

  const searchFeed = useSelector((state) => {
    console.log(state.RSSReducer.feed);
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
      <div className={styles.channelPopUpboard}>
        <div className={styles.titleWrapper}>
          <SearchIcon
            fontSize="large"
            color="white"
            style={{ color: "white" }}
          />
          <h1 className={styles.title}>{feed.title}</h1>
        </div>
        {/* <div dangerouslySetInnerHTML={{ __html: feed.description }}></div> */}

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
