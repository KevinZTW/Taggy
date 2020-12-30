import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase.js";
import CardWrapper from "../CardWrapper.jsx";
import dispatch from "react-redux";
import styles from "./GroupBoard.module.css";
import { FETCHARTICLE } from "../../redux/actions";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import EditIcon from "@material-ui/icons/Edit";
import AddArticle from "../AddArticle";
import firebase from "firebase/app";
import teamImg from "../../imgs/undraw_team.svg";
import team_img from "../../imgs/undraw_team.svg";
import { render } from "react-dom";
import CloseIcon from "@material-ui/icons/Close";

export default function Board(props) {
  const dispatch = useDispatch();
  const [memberList, setMemberList] = useState([]);
  const [filteredMemberList, setFilteredMemberList] = useState([]);
  const [memberEmailList, setMemberEmailList] = useState([]);

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
  // const memebrList = getMembers();
  // function getMembers() {
  //   let memberList = [];
  //   return db
  //     .collection("Member")
  //     .get()
  //     .then((snapShot) => {
  //       sn;
  //       memberList.push({
  //         email: doc.data().emil,
  //         uid: doc.data().uid,
  //         password: doc.data().password,
  //       });
  //       return memberList;
  //     });
  // }
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
              tags: doc.data().tags,
              link: doc.data().link,
              readerHtml: doc.data().readerHtml,
            });
          });
          //console.log(list);
          dispatch(FETCHARTICLE(list));
        });
    }
    if (groupId) {
      checkArticleUpdate(groupId);
    }
  }, [groupId]);

  useEffect(() => {
    let unsubscribe;
    function getLatestMemberList() {
      unsubscribe = db.collection("Member").onSnapshot((snapshot) => {
        const memberList = [];
        const memberEmailList = [];
        snapshot.forEach((doc) => {
          memberList.push({
            displayname: doc.data().displaynamename,
            email: doc.data().email,
            uid: doc.data().uid,
          });
        });
        setMemberList(memberList);
      });
    }
    getLatestMemberList();
    return () => {
      unsubscribe();
    };
  }, []);

  function handleChange(input) {
    if (input !== "") {
      const filteredMemberList = memberList.filter((member) => {
        //console.log(member);
        return member.email.includes(input);
      });
      //console.log(filteredMemberList);
      setFilteredMemberList(filteredMemberList);
    }
  }

  function renderSearchResult(filteredMemberList) {
    const searchResult = [];
    filteredMemberList.forEach((member, index) => {
      const colorList = [
        "	#007979",
        "#019858",
        "#004B97",
        "	#AE8F00",
        "#408080",
        "	#5B00AE",
        "	#D94600",
        "#5151A2",
        "	#006000",
        "	#000093",
        "	#007979",
        "#019858",
        "#004B97",
        "	#AE8F00",
        "#408080",
        "	#5B00AE",
        "	#D94600",
        "#5151A2",
        "	#006000",
        "	#000093",
        "	#007979",
        "#019858",
        "#004B97",
        "	#AE8F00",
        "#408080",
        "	#5B00AE",
        "	#D94600",
        "#5151A2",
        "	#006000",
        "	#000093",
        "	#007979",
        "#019858",
        "#004B97",
        "	#AE8F00",
        "#408080",
        "	#5B00AE",
        "	#D94600",
        "#5151A2",
        "	#006000",
        "	#000093",
      ];

      searchResult.push(
        <div
          className={styles.memberWrapper}
          id={member.uid}
          onClick={(e) => {
            //console.log(e.currentTarget);
            addMemberToGroup(e.currentTarget.id, groupId);
          }}
        >
          <div
            className={styles.memberHead}
            style={{ background: colorList[index] }}
          >
            {member.displayname[0]}
          </div>
          <div className={styles.wordWrapper}>
            <div className={styles.displayname}>{member.displayname}</div>
            <div className={styles.email}>{member.email}</div>
          </div>
          <button>Add</button>
        </div>
      );
    });
    return searchResult;
  }
  function addMemberToGroup(uid, groupId) {
    db.collection("Member")
      .doc(uid)
      .update({
        board: firebase.firestore.FieldValue.arrayUnion(groupId),
      })
      .then(() => {
        db.collection("GroupBoard")
          .doc(groupId)
          .update({
            member: firebase.firestore.FieldValue.arrayUnion(uid),
          });
      })
      .then(() => {
        alert("succesfully add to group");
      });
  }
  const articleList = useSelector((state) => {
    return state.articleReducer.articleList;
  });
  //console.log(articleList);
  const searchResult = renderSearchResult(filteredMemberList);
  //console.log(searchResult);
  //console.log(filteredMemberList);
  return (
    <div
      className={styles.boardWrapper}
      onClick={() => {
        setFilteredMemberList([]);
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
              //console.log(addMember);
            }}
          />
          {addMember ? (
            <div
              className={styles.addMemberWrapper}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className={styles.addTitle}>Invite to board</div>
              <CloseIcon
                className={styles.cancelIcon}
                fontSize="small"
                onClick={() => {
                  setFilteredMemberList([]);
                  setAddMember(false);
                }}
              />
              <form action="">
                <input
                  type="text"
                  onChange={(e) => {
                    //console.log(e.target.value);
                    if (e.target.value === "") {
                      setFilteredMemberList([]);
                    }
                    //console.log("hihi");
                    handleChange(e.target.value);
                  }}
                />
              </form>
              {searchResult}
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
