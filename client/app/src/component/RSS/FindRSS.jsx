import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { localUrl, ec2Url } from "../../config.js";
import styles from "./FindRSS.module.css";
import * as RSSParser from "rss-parser";
import { GETRSSRESPONSE } from "../../redux/actions";
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
        let parser = new RSSParser();
        parser.parseURL(url, function (err, feed) {
          if (err) {
            throw dispatch(GETRSSRESPONSE(err));
          }
          dispatch(GETRSSRESPONSE(feed, url));
        });
        throw dispatch(GETRSSRESPONSE(err));
      }
      console.log(feed);
      console.log(feed.title);
      dispatch(GETRSSRESPONSE(feed, url));
      feed.items.forEach(function (entry) {
        console.log(entry.title + ":" + entry.link);
      });
    });
  }

  return (
    <div className={styles.addArticle}>
      <form
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
          搜尋RSS
        </button>
      </form>
    </div>
  );
}
