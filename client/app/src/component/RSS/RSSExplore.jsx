import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FindRSS from "./FindRSS";
import { db } from "../../firebase.js";
import RSSCard from "./RSSCard";
import { INITARTICLE } from "../../redux/actions";
import styles from "./RSSBoard.module.css";
import { app } from "../../lib/lib.js";
import RSSPage from "./RSSPage";
import sfLogo from "../../img/sf_logo.png";
import { style } from "d3";
export default function Board(props) {
  const [showPage, setShowPage] = useState(false);
  const [feedItem, setFeedItem] = useState("");
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
      <FindRSS className="headMemberIcon" user={props.user} />
      <div className={styles.title}># Explore</div>
      <div className={styles.categoryTitle}>Tech</div>
      <div className={styles.categoryWrapper}>
        <div className={styles.categoryCard}>
          <div className={styles.cardUpper}>
            <div className={styles.cardImg}>
              <img src={sfLogo} alt="" />
            </div>
            <div className={styles.cardWording}>
              <div className={styles.cardTitle}>Segment Fault - 前端</div>
              <div className={styles.cardDescription}>前端新知</div>
            </div>
          </div>
          <div className={styles.cardBtn}>Follow</div>
        </div>
        <div className={styles.categoryCard}>
          <div className={styles.cardUpper}>
            <div className={styles.cardImg}>
              <img src={sfLogo} alt="" />
            </div>
            <div className={styles.cardWording}>
              <div className={styles.cardTitle}>掘金前端</div>
              <div className={styles.cardDescription}>前端新知</div>
            </div>
          </div>
          <div className={styles.cardBtn}>Follow</div>
        </div>
        <div className={styles.categoryCard}>
          <div className={styles.cardUpper}>
            <div className={styles.cardImg}>
              <img src={sfLogo} alt="" />
            </div>
            <div className={styles.cardWording}>
              <div className={styles.cardTitle}>Segment Fault - 前端</div>
              <div className={styles.cardDescription}>前端新知</div>
            </div>
          </div>
          <div className={styles.cardBtn}>Follow</div>
        </div>
        <div className={styles.categoryCard}>
          <div className={styles.cardUpper}>
            <div className={styles.cardImg}>
              <img src={sfLogo} alt="" />
            </div>
            <div className={styles.cardWording}>
              <div className={styles.cardTitle}>Segment Fault - 前端</div>
              <div className={styles.cardDescription}>前端新知</div>
            </div>
          </div>
          <div className={styles.cardBtn}>Follow</div>
        </div>
        <div className={styles.categoryCard}>
          <div className={styles.cardUpper}>
            <div className={styles.cardImg}>
              <img src={sfLogo} alt="" />
            </div>
            <div className={styles.cardWording}>
              <div className={styles.cardTitle}>Segment Fault - 前端</div>
              <div className={styles.cardDescription}>前端新知</div>
            </div>
          </div>
          <div className={styles.cardBtn}>Follow</div>
        </div>
      </div>

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
