import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase.js";
import CardWrapper from "../CardWrapper.jsx";
import styles from "../Board.module.css";
import { ADDFETCHARTICLE } from "../../redux/actions";

export default function GraphBoard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  useEffect(() => {
    function checkArticleUpdate(uid) {
      db.collection("Articles")
        .orderBy("date", "desc")
        .where("uid", "==", uid)
        .onSnapshot(function (querySnapshot) {
          const list = [];
          querySnapshot.forEach(function (doc) {
            list.push({
              title: doc.data().title,
              content: doc.data().markDown.slice(0, 100),
              id: doc.data().id,
              link: doc.data().link,
              tags: doc.data().tags,
              readerHtml: doc.data().readerHtml,
            });
          });
          dispatch(ADDFETCHARTICLE(list));
        });
    }
    if (user) {
      checkArticleUpdate(user.uid);
    }
  }, [user]);
  return (
    <div className={styles.graphBoardWrapper}>
      <div className={styles.boardWrapper}>
        <div className={styles.title}>Graph View</div>
        <div className={styles.description}>
          Review your knowledge by clicking the tag dot!{" "}
        </div>

        <CardWrapper />
      </div>
    </div>
  );
}
