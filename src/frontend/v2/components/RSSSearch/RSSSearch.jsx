import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import styles from "./RSSSearch.module.css";

import LinearProgress from "@mui/material/LinearProgress";

import addRSSImg from '@/pages/imgs/add_RSS_feed.png';


export default function RSSSearch(props) {
  const [reqUrl, setReqUrl] = useState("https://medium.com/better-programming");
  const [loading, setLoading] = useState(false);


  const notify_fail = () =>
    toast.warn(<div>Sorry....sth goes wrong, please try again later</div>, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const user = {
    uid: "123",
  }
  function requestRSS(url) {
    setLoading(true);
    if (url.includes("medium.com/@")) {
      url =
        "https://medium.com/feed/@" + url.replace("https://medium.com/@", "");
    } else if (url.includes(".medium.com")) {
      url =
        "https://medium.com/feed/@" +
        url.replace("https://", "").replace(".medium.com", "");
    } else if (url.includes("medium.com/")) {
      url = "https://medium.com/feed/" + url.replace("https://medium.com/", "");
    } else if (url.includes("youtube.com/channel")) {
      url =
        "https://www.youtube.com/feeds/videos.xml?channel_id=" +
        url.replace("https://www.youtube.com/channel/", "");
    }
    


    parser.parseURL(CORS_PROXY + url, function (err, feed) {
      if (err) {
        fetch( "/route/rss/fetch", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({ url: url }),
        }).then(function (response) {
          if (response.status !== 200) {
            notify_fail();
          } else {
            response.json().then((data) => {
              dispatch(GETRSSRESPONSE(data.rss, url));
              setLoading(false);
              props.showChannel();
            });
          }
        });
      } else {
        props.showChannel();
        setLoading(false);
        feed.items.forEach(function (entry) {});
      }
    });
  }

  return (
    <div className={styles.addArticle}>
      <label htmlFor="addForm" className={styles.addFolderLabel}>
        Enter URL link
      </label>
      <div className={styles.addFormWrapper}>
        <form
          className={styles.addForm}
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            if (user) {
              requestRSS(reqUrl);
            }
          }}
        >
          <input
            type="text"
            name="input"
            className={styles.addInput}
            value={reqUrl}
            placeholder=""
            onChange={(e) => setReqUrl(e.currentTarget.value)}
          />
          <button type="submit" className={styles.saveBtn}>
            Search
          </button>
          <Link href="/">
            <button onClick={() => {}} className={styles.cancelBtn}>
              Cancel
            </button>
          </Link>
        </form>
      </div>
      {loading ? <LinearProgress className={styles.progress} /> : ""}
      <div className={styles.tagsImgWrapper}>
        <img src={addRSSImg} alt="" />
      </div>
    </div>
  );
}
