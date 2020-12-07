import { useLocation, useHistory } from "react-router-dom";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase.js";
import ArrowBack from "@material-ui/icons/ArrowBack";
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

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <ArrowBack
          style={{ color: "#FFFCEC", cursor: "pointer" }}
          onClick={props.onClick}
        />
      </div>
      <div className={styles.title}>{feedItem.title}</div>
      <div dangerouslySetInnerHTML={{ __html: feedItem.content }}></div>
    </div>
  );
}
