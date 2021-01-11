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
  const fetchRequired = useSelector(
    (state) => state.articleReducer.fetchRequired
  );
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
          .limit(30)
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
      batchFetchUserArticles(user.uid);
    }
  }, [fetchRequired, user]);
  let articleSnapshotInit = false;
  useEffect(() => {
    let unsubscribe;
    if (user) {
      unsubscribe = db
        .collection("Articles")
        .where("uid", "==", user.uid)
        .onSnapshot(() => {
          if (articleSnapshotInit) {
            dispatch(RESETARTICLEFETCH());
          }
        });

      articleSnapshotInit = true;
    }
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [user]);

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
