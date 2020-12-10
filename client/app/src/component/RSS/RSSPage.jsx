import { useLocation, useHistory } from "react-router-dom";
import { localUrl, ec2Url } from "../../config.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase.js";
import ArrowBack from "@material-ui/icons/ArrowBack";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import styles from "./RSSPage.module.css";
import { app } from "../../lib/lib.js";

import { useSelector } from "react-redux";

export default function RSSPage(props) {
  console.log("page rerender, props is ", props.item);
  const [feedItem, setFeedItem] = useState({});
  const location = useLocation();
  let search = location.search;
  let params = new URLSearchParams(search);

  let user = useSelector((state) => {
    return state.memberReducer.user;
  });
  function postDataToServer(
    url,
    data = {
      url: "www.sylish.com",
      uid: "12344",
    }
  ) {
    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (data) {
          console.log(data);
          alert(data.msg);
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }
  useEffect(() => {
    if (props.item) {
      console.log(props.item);
      setFeedItem(props.item);
    } else {
      console.log("this is in else ...run");
      //   console.log("useeffect run");
      //   app.getFeedContent(feedId).then((feedItem) => {
      //     console.log(feedItem);
      //     setFeedItem(feedItem);
      //   });
    }
  }, [props.item]);

  //   useEffect(() => {
  //     function getArticles() {
  //       db.collection("Articles")
  //         .doc(id)
  //         .onSnapshot(function (doc) {
  //           setArticle({
  //             title: doc.data().title,
  //             markDown: doc.data().markDown,
  //           });
  //         });
  //     }
  //     getArticles();
  //   }, []);
  console.log(feedItem);
  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <ArrowBack
          style={{ color: "#FFFCEC", cursor: "pointer" }}
          onClick={props.onClick}
        />
        <BookmarkBorderIcon
          onClick={() => {
            postDataToServer(localUrl, {
              url: feedItem.link,
              uid: user.uid,
            });
          }}
        />
      </div>
      <div className={styles.title}>{feedItem.title}</div>
      <div dangerouslySetInnerHTML={{ __html: feedItem.content }}></div>
    </div>
  );
}