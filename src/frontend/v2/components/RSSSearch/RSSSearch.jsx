import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import styles from "./RSSSearch.module.css";

import LinearProgress from "@mui/material/LinearProgress";

import addRSSImg from '@/public/imgs/add_RSS_feed.png';

import ApiGateway from "@/gateways/Api.gateway";

export default function RSSSearch({setRSSFeed}) {
  const [reqUrl, setReqUrl] = useState("https://medium.com/better-programming");
  const [loading, setLoading] = useState(false);


  const notify_fail = () => {
    toast.warn("sorry, we can't find RSS with provided url", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  
  function requestRSS(url) {
    setLoading(true);

    // TODO: this part logic should be moved to backend
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
    

    ApiGateway.addRSSFeed(url).then((source) => {
      setLoading(false);
      setRSSFeed(source);
    }).catch((err) => {
      setLoading(false);
      notify_fail();
    });
  }

  return (
    <div className={styles.addArticle}>
      <label htmlFor="addForm" className={styles.addFolderLabel}>
        Enter RSS URL
      </label>
      <div className={styles.addFormWrapper}>
        <form
          className={styles.addForm}
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            requestRSS(reqUrl);
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
        <img src={addRSSImg.src} alt="" />
      </div>
    </div>
  );
}
