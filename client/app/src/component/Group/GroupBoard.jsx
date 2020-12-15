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
import teamImg from "../../img/undraw_team.svg";
import team_img from "../../img/undraw_team.svg";

export default function Board(props) {
  const dispatch = useDispatch();
  const [addMember, setAddMember] = useState(false);

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  const groupId = useSelector((state) => {
    return state.groupReducer.groupId;
  });
  const groupName = useSelector((state) => {
    return state.groupReducer.groupName;
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
          console.log(list);
          dispatch(INITARTICLE(list));
        });
    }
    if (groupId) {
      checkArticleUpdate(groupId);
    }
  }, [groupId]);
  const articleList = useSelector((state) => {
    return state.articleReducer.articleList;
  });
  console.log(articleList);
  return (
    <div
      className={styles.boardWrapper}
      onClick={() => {
        setAddMember(false);
      }}
    >
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{groupName}</div>

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

      {articleList[0] ? (
        <CardWrapper />
      ) : (
        <div class={styles.emptyWrapper}>
          <img src={team_img} alt="" />
          <div class={styles.subtitle}>
            Share the content by using our extension
          </div>
        </div>
      )}
    </div>
  );
}
