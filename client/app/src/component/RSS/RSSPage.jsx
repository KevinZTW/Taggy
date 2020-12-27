import { useLocation, useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { localUrl, ec2Url } from "../../config.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase.js";
import { ToastContainer, toast } from "react-toastify";
import ArrowBack from "@material-ui/icons/ArrowBack";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import styles from "./RSSPage.module.css";
import { app } from "../../lib/lib.js";

import { useSelector } from "react-redux";

export default function RSSPage(props) {
  console.log("page rerender, props is ", props.item);
  const [feedItem, setFeedItem] = useState({});
  const [youtube, setYoutube] = useState(false);
  const location = useLocation();
  let search = location.search;
  let params = new URLSearchParams(search);
  const notify_success = () =>
    toast.dark(
      <div>
        successfully save to article <Link to="/board">go check it</Link>
      </div>,

      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  const notify_fail = () =>
    toast.warn(
      <div>fail, please try again later</div>,

      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
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
          notify_fail();
          return;
        }
        response.json().then(function (data) {
          console.log(data);
          notify_success();
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
        notify_fail();
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
  let youtubeUrl = "";
  if (feedItem.media) {
    youtubeUrl = feedItem.media[0]["media:content"][0]["$"]["url"].replace(
      "https://www.youtube.com/v/",
      ""
    );
    console.log(feedItem.media[0]);
    console.log(feedItem.media[0]["media:thumbnail"][0]["$"]["url"]);
    console.log(feedItem.media[0]["media:content"][0]["$"]["url"]);
  }

  return (
    <div>
      {feedItem.media ? (
        <div className={styles.page}>
          <div className={styles.head}>
            <div className={styles.arrowWrapper}>
              <ArrowBack
                style={{ color: "#FFFCEC", cursor: "pointer" }}
                onClick={props.onClick}
              />
            </div>
            <BookmarkBorderIcon
              style={{ color: "#FFFCEC", cursor: "pointer" }}
              onClick={() => {
                postDataToServer(ec2Url, {
                  url: feedItem.link,
                  uid: user.uid,
                });
              }}
            />
          </div>
          <div className={styles.title}>{feedItem.title}</div>
          <iframe
            width="640"
            height="390"
            title="hihi"
            src={"https://www.youtube.com/embed/" + youtubeUrl}
          ></iframe>
          <div
            dangerouslySetInnerHTML={{
              __html: feedItem.content || feedItem["content:encoded"],
            }}
            className={styles.content}
          ></div>
        </div>
      ) : (
        <div className={styles.page}>
          <div className={styles.head}>
            <ArrowBack
              className={styles.backIcon}
              style={{ color: "#FFFCEC", cursor: "pointer" }}
              onClick={props.onClick}
            />
            <Tooltip title="save for later" backgroundColor="blue" arrow>
              <BookmarkBorderIcon
                className={styles.saveIcon}
                style={{ color: "#FFFCEC", cursor: "pointer" }}
                onClick={() => {
                  postDataToServer(ec2Url, {
                    url: feedItem.link,
                    uid: user.uid,
                  });
                }}
              />
            </Tooltip>
          </div>
          <div className={styles.title}>{feedItem.title}</div>
          <div
            dangerouslySetInnerHTML={{
              __html: feedItem.content || feedItem["content:encoded"],
            }}
            className={styles.content}
          ></div>
        </div>
      )}
    </div>
  );
}
