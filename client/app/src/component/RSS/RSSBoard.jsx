import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase.js";
import RSSCard from "./RSSCard";
import dispatch from "react-redux";
import { INITARTICLE } from "../../redux/actions";
export default function Board(props) {
  const dispatch = useDispatch();

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  const searchFeed = useSelector((state) => {
    return state.RSSReducer.feed;
  });
  function renderSearchFeed(feed) {
    let feedList = [];
    for (let i in feed.items) {
      feedList.push(<RSSCard item={feed.items[i]} />);
    }
    return (
      <div>
        <h1>{feed.title}</h1>
        <div>{feed.description}</div>
        <button>Subscribe</button>
        {feedList}
      </div>
    );
  }
  //   useEffect(() => {

  //     if (searchFeed) {
  //       checkArticleUpdate(user.uid);
  //     }
  //   }, [user]);

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
  return <div>{searchOutcome}</div>;
}
