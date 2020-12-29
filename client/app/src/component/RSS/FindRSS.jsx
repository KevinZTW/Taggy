import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { local, ec2Url } from "../../config.js";
import styles from "./FindRSS.module.css";
import * as RSSParser from "rss-parser";
import LinearProgress from "@material-ui/core/LinearProgress";
import { GETRSSRESPONSE } from "../../redux/actions";
import addRSSImg from "../../img/add_RSS_feed.png";
import Axios from "axios";
export default function FindRSS(props) {
  const [reqUrl, setReqUrl] = useState(
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCUMZ7gohGI9HcU9VNsr2FJQ"
  );
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
      console.log(url);

      console.log(" medium member");
      url =
        "https://medium.com/feed/@" + url.replace("https://medium.com/@", "");
    } else if (url.includes("medium.com/")) {
      url = "https://medium.com/feed/" + url.replace("https://medium.com/", "");
    } else if (url.includes("youtube.com/channel")) {
      url =
        "https://www.youtube.com/feeds/videos.xml?channel_id=" +
        url.replace("https://www.youtube.com/channel/", "");
    }
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    let parser = new RSSParser({
      customFields: {
        item: [["media:group", "media", { keepArray: true }]],
      },
    });
    console.log("start to send the requett");
    let starttime = Date.now();
    parser.parseURL(CORS_PROXY + url, function (err, feed) {
      if (err) {
        console.log("error, refetch from nbackend");
        fetch("https://www.shopcard.site/route/" + "rss/fetch", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({ url: url }),
        }).then(function (response) {
          if (response.status !== 200) {
            console.log("sth goes wrong in backend ");
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
        console.log(
          "get feed, it took",
          (Date.now() - starttime) / 1000,
          "seconds"
        );
        // ==================== speed testing
        // let starttime2 = Date.now();
        // console.log("start to send the requett to back end");
        // fetch("https://www.shopcard.site/route/" + "rss/fetch", {
        //   method: "post",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ url: url }),
        // }).then(function (response) {
        //   if (response.status !== 200) {
        //     console.log("sth goes wrong in backend ");
        //   } else {
        //     response.json().then((data) => {
        //       console.log(
        //         "it tooks",
        //         (Date.now() - starttime2) / 1000,
        //         "seconds"
        //       );
        //       dispatch(GETRSSRESPONSE(data.rss, url));
        //       setLoading(false);
        //       props.showChannel();
        //     });
        //   }
        // });
        // upper are speed testing
        console.log(feed);
        props.showChannel();
        console.log(feed.title);
        dispatch(GETRSSRESPONSE(feed, url));
        setLoading(false);
        feed.items.forEach(function (entry) {
          console.log(entry.title + ":" + entry.link);
        });
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

      {/* <div>https://www.youtube.com/channel/UCcabW7890RKJzL968QWEykA</div>
      <div>https://medium.com/appworks-school</div>
      <div>https://medium.com/@lindingchi</div> */}
    </div>
  );
}
