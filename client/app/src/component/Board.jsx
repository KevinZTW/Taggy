import { useDispatch, useSelector } from "react-redux";
import { app } from "../lib/lib.js";
import { db } from "../firebase.js";
import React, { useEffect } from "react";
import CardWrapper from "./CardWrapper.jsx";

import styles from "./Board.module.css";
import {
  ADDFETCHARTICLE,
  SWITCHARTICLEFETCH,
  RESETARTICLEFETCH,
} from "../redux/actions";

export default function Board(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.memberReducer.user);
  console.log(user);
  const fetchRequired = useSelector(
    (state) => state.articleReducer.fetchRequired
  );
  console.log(fetchRequired);
  const articleList = useSelector((state) => state.articleReducer.articleList);
  const lastQuery = useSelector((state) => state.articleReducer.lastQuery);
  useEffect(() => {
    const handleScroll = () => {
      app.util.handleScrollBottom(() => {
        dispatch(SWITCHARTICLEFETCH(true));
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (lastQuery) {
  }
  useEffect(() => {
    function batchFetchUserArticles(userUid) {
      if (lastQuery === null) {
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
            dispatch(ADDFETCHARTICLE(tempArticleList, lastQuery));
          });
      } else {
        if (lastQuery) {
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
              dispatch(ADDFETCHARTICLE(tempArticleList, lastQuery));
            });
        }
      }
    }

    if (user && fetchRequired) {
      console.log("fetch start");
      batchFetchUserArticles(user.uid);
    }
  }, [fetchRequired, user]);
  let articleSnapshotInit = false;
  useEffect(() => {
    console.log("her run!", articleSnapshotInit);
    let unsubscribe;
    if (user && !articleSnapshotInit) {
      articleSnapshotInit = true;
    } else if (articleSnapshotInit === true) {
      unsubscribe = db
        .collection("Articles")
        .where("uid", "==", user.uid)
        .onSnapshot(() => {
          dispatch(RESETARTICLEFETCH());
        });
      articleSnapshotInit = true;
    }
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [user]);
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
