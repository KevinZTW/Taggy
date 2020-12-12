import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase.js";
import CardWrapper from "../CardWrapper.jsx";
import dispatch from "react-redux";
import styles from "./GroupBoard.module.css";
import { INITARTICLE } from "../../redux/actions";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import EditIcon from "@material-ui/icons/Edit";
import AddArticle from "../AddArticle";
import firebase from "firebase/app";

export default function Board(props) {
  const dispatch = useDispatch();
  const [addMember, setAddMember] = useState(false);
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  useEffect(() => {
    function checkArticleUpdate(uid) {
      db.collection("Articles")
        .orderBy("date", "desc")
        .where("uid", "==", uid)
        .onSnapshot(function (querySnapshot) {
          let list = [];
          querySnapshot.forEach(function (doc) {
            list.push({
              title: doc.data().title,
              content: doc.data().markDown.slice(0, 100),
              id: doc.data().id,
              tags: doc.data().tags,
              readerHtml: doc.data().readerHtml,
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
    <div
      className={styles.boardWrapper}
      onClick={() => {
        setAddMember(false);
      }}
    >
      <AddArticle className="headMemberIcon" user={user} />
      <div className={styles.titleWrapper}>
        <div className={styles.title}>前端群組</div>

        <div className={styles.actionList}>
          <EditIcon />
          <GroupAddIcon
            onClick={(e) => {
              e.stopPropagation();
              setAddMember(true);
              console.log(addMember);
            }}
          />
          {addMember ? (
            <div
              className={styles.addMemberWrapper}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div>Add New Member</div>
              <form action="">
                <input type="text" />
              </form>
              <hr />
              <div className={styles.memberWrapper}>
                <div>kevin@gmail.com</div>
                <button>Add</button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <CardWrapper />
    </div>
  );
}
