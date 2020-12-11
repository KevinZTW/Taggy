import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { local, ec2Url } from "../../config.js";
import styles from "./FindRSS.module.css";
import * as RSSParser from "rss-parser";
import { GETRSSRESPONSE } from "../../redux/actions";
import Axios from "axios";
export default function FindRSS(props) {
  const [reqUrl, setReqUrl] = useState("");
  const dispatch = useDispatch();

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  function requestRSS(url) {
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    let parser = new RSSParser();
    parser.parseURL(CORS_PROXY + url, function (err, feed) {
      if (err) {
        fetch(local + "rss/fetch", {
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
            });
          }
        });
      } else {
        console.log(feed);
        console.log(feed.title);
        dispatch(GETRSSRESPONSE(feed, url));
        feed.items.forEach(function (entry) {
          console.log(entry.title + ":" + entry.link);
        });
      }
    });
  }

  return (
    <div className={styles.addArticle}>
      <div class={styles.addTitle}>Add new source to reach this world</div>
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
          onChange={(e) => setReqUrl(e.currentTarget.value)}
        />
        <button type="submit" className={styles.add}>
          搜尋
        </button>
      </form>
    </div>
  );
}
