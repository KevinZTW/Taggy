import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import styles from "./FindRSS.module.css";
import * as RSSParser from "rss-parser";
import LinearProgress from "@material-ui/core/LinearProgress";
import { GETRSSRESPONSE } from "../../redux/actions";
import addRSSImg from "../../imgs/add_RSS_feed.png";
import {host} from "../../config"
export default function FindRSS(props) {
  const [reqUrl, setReqUrl] = useState("https://medium.com/better-programming");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
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
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    const parser = new RSSParser({
      customFields: {
        item: [["media:group", "media", { keepArray: true }]],
      },
    });

    const starttime = Date.now();
    parser.parseURL(CORS_PROXY + url, function (err, feed) {
      if (err) {
        fetch(host + "/route/rss/fetch", {
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

        dispatch(GETRSSRESPONSE(feed, url));
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
          <Link to="/home">
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
