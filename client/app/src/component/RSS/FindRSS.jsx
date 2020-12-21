import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { local, ec2Url } from "../../config.js";
import styles from "./FindRSS.module.css";
import * as RSSParser from "rss-parser";
import LinearProgress from "@material-ui/core/LinearProgress";
import { GETRSSRESPONSE } from "../../redux/actions";
import Axios from "axios";
export default function FindRSS(props) {
  const [reqUrl, setReqUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
          } else {
            response.json().then((data) => {
              dispatch(GETRSSRESPONSE(data.rss, url));
              setLoading(false);
              props.showChannel();
            });
          }
        });
      } else {
        console.log("get feed, ");
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
          className={styles.input}
          value={reqUrl}
          placeholder=""
          onChange={(e) => setReqUrl(e.currentTarget.value)}
        />
        <button type="submit" className={styles.add}>
          Search
        </button>
      </form>
      {loading ? <LinearProgress className={styles.progress} /> : ""}
      <br />
      <div class={styles.addTitle}>
        Now supporting general rss link, youtube and medium channel/member's
        article
      </div>
      <div class={styles.addTitle}>e.g.</div>

      <div>https://www.youtube.com/channel/UCcabW7890RKJzL968QWEykA</div>
      <div>https://medium.com/appworks-school</div>
      <div>https://medium.com/@lindingchi</div>
    </div>
  );
}
