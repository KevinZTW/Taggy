import { Zoom } from "react-toastify";

import FeedCard from "@/components/FeedCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Chip } from "@mui/material";
import { toast } from "react-toastify";
import ArrowBack from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Tooltip from "@mui/material/Tooltip";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

import styles from "./FeedPage.module.css";


export default function FeedPage({ item, onClick }) {
  const [tagRecoms, setTagRecoms] = useState([]);
  const [newItem, setNewItem] = useState([]);

  // useEffect(() => {
  //   async function getFeedTagsRecommend(feedId) {
  //     const response = await fetch(
  //       host + `/route/rss/feedtags?feedid=${feedId}`
  //     );
  //     return response.json();
  //   }
  //   function setFeedTagRecommend(data) {
  //     setTagRecoms(data);
  //   }
  //   if (item || newItem) {
  //     getFeedTagsRecommend(newItem.FeedId || item.id || item.FeedId).then(
  //       setFeedTagRecommend
  //     );
  //   }
  // }, [item, newItem]);

  function renderFeedTags(tags) {
    const tagChips = [];
    if (tags) {
      tags.forEach((tag) => {
        tagChips.push(
          <Chip
            size="small"
            label={"#" + tag}
            style={{
              marginRight: "6px",
              border: "solid 1px white",
              color: "white",
            }}
            variant="outlined"
          />
        );
      });
    }
    return tagChips;
  }
  function renderMoreFeeds(feeds) {
    const moreFeeds = [];
    if (feeds) {
      feeds.forEach((feed) => {
        moreFeeds.push(
          <FeedCard
            item={feed}
            onClick={() => {
              setNewItem(feed);
              document
                .querySelector("#FeedPage")
                [`scrollTo`]({ top: 0, behavior: `smooth` });
            }}
          />
        );
      });
    }
    return moreFeeds;
  }
  const user = {
    uid: 123,
  }

  const tagChips = renderFeedTags(tagRecoms.tags);
  const moreFeeds = renderMoreFeeds(tagRecoms.feeds);
  return (
    <div>
        <div className={styles.page} id="FeedPage">
          <div className={styles.head}>
            <div className={styles.arrowWrapper}>
              <ArrowBack
                className={styles.Icon}
                style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                onClick={onClick}
              />
            </div>
            <Tooltip title="save to my board" placement="right" arrow sx={{color: "white",
    fontFamily: "Open Sans", fontSize: 14}}>
              <div
                className={styles.arrowWrapper}
                onClick={() => {
                  alert("TODO: implement save to my board")
                }}
              >
                <BookmarkBorderIcon
                  className={styles.Icon}
                  style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                />
              </div>
            </Tooltip>
          </div>
          <div className={styles.title}>{newItem.title || item.title}</div>
          <div className={styles.chipsWrapper}>{tagChips}</div>

          <div
            dangerouslySetInnerHTML={{
              __html:
                newItem.content || item.content || item["content:encoded"],
            }}
            className={styles.content}
          ></div>
          <div className={styles.more}>More from Taggy</div>

          <div>{moreFeeds}</div>
        </div>
    </div>
  );
}
