import { useDispatch, useSelector } from "react-redux";
import { app } from "../lib/lib.js";
import { db } from "../firebase.js";
import React, { useEffect, useState } from "react";
import CardWrapper from "./CardWrapper.jsx";
import dispatch from "react-redux";
import styles from "./Board.module.css";
import { FETCHARTICLE } from "../redux/actions";

export default function Board(props) {
  const dispatch = useDispatch();
  // const [lastQueryDoc, setLastQueryDoc] = useState("");
  const [articleFetchTimes, setArticleFetchTimes] = useState(0);
  const user = useSelector((state) => state.memberReducer.user);
  const articleList = useSelector((state) => state.articleReducer.articleList);

  useEffect(() => {
    const handleScroll = () => {
      app.util.handleScroll(articleFetchTimes, setArticleFetchTimes);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [articleFetchTimes]);
  const lastQuery = useSelector((state) => state.articleReducer.lastQuery);

  if (lastQuery) {
  }
  useEffect(() => {
    function batchFetchUserArticles(userUid, articleFetchTimes) {
      if (lastQuery === null && userUid) {
        db.collection("Articles")
          .orderBy("date", "desc")
          .where("uid", "==", userUid)
          .limit(8)
          .get()
          .then((snapshot) => {
            const tempArticleList = [...articleList];
            snapshot.forEach((doc) => {
              tempArticleList.push(doc.data());
            });
            const lastQuery = snapshot.docs[snapshot.docs.length - 1];
            dispatch(FETCHARTICLE(tempArticleList, lastQuery));
          });
      } else {
        if (lastQuery && userUid) {
          db.collection("Articles")
            .orderBy("date", "desc")
            .where("uid", "==", userUid)
            .startAfter(lastQuery)
            .limit(8)
            .get()
            .then((snapshot) => {
              const tempArticleList = [...articleList];
              snapshot.forEach((doc) => {
                tempArticleList.push(doc.data());
              });
              const lastQuery = snapshot.docs[snapshot.docs.length - 1];
              dispatch(FETCHARTICLE(tempArticleList, lastQuery));
            });
        }
      }
    }
    if (user) {
      batchFetchUserArticles(user.uid, articleFetchTimes);
    }
  }, [articleFetchTimes, user]);

  // useEffect(() => {
  //   function checkArticleUpdate(uid) {
  //     db.collection("Articles")
  //       .orderBy("date", "desc")
  //       .where("uid", "==", uid)
  //       .onSnapshot(function (querySnapshot) {
  //         const list = [];

  //         querySnapshot.forEach(function (doc) {
  //           list.push({
  //             title: doc.data().title,
  //             content: doc.data().markDown.slice(100, 200),
  //             id: doc.data().id,
  //             tags: doc.data().tags,
  //             link: doc.data().link,
  //             readerHtml: doc.data().readerHtml,
  //           });
  //         });
  //         dispatch(INITARTICLE(list));
  //       });
  //   }
  //   if (user) {
  //     checkArticleUpdate(user.uid);
  //   }
  // }, [user]);

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.title}>Saved Article</div>
      <div className={styles.description}>
        The article you saved from web and RSS feed, read it anytime you want!
      </div>
      <CardWrapper />
    </div>
  );
}
