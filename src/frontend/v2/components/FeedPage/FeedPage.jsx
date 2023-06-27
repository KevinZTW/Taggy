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


export default function FeedPage({ item, goBack }) {
  console.log("item", item)
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function getFeedTags(feedId) {
      const response = await fetch(
        `/api/tags/?feedId=${feedId}`
      );
      return response.json();
    }
    
    if (item) {
      getFeedTags(item.id).then(
        data => {setTags(data)}
      );
    }
  }, [item]);

  function renderFeedTags(tags) {
    const tagChips = [];
    if (tags) {
      tags.forEach((tag) => {
        tagChips.push(
          <Chip
            size="small"
            label={"#" + tag.name}
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
            // onClick={() => {
            //   setNewItem(feed);
            //   document
            //     .querySelector("#FeedPage")
            //     [`scrollTo`]({ top: 0, behavior: `smooth` });
            // }}
          />
        );
      });
    }
    return moreFeeds;
  }
  const user = {
    uid: 123,
  }

  const tagChips = renderFeedTags(tags);
  // const moreFeeds = renderMoreFeeds(tags.feeds);
  return (
    item ? (
    <div>
        <div className={styles.page} id="FeedPage">
          <div className={styles.head}>
            <div className={styles.arrowWrapper} onClick={goBack}>
              <ArrowBack
                className={styles.Icon}
                style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
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
          <div className={styles.title}>{item?.title}</div>
          <div className={styles.chipsWrapper}>{tagChips}</div>

          <div
            dangerouslySetInnerHTML={{
              __html:
                 item.content || item["content:encoded"],
            }}
            className={styles.content}
          ></div>
          <div className={styles.more}>More from Taggy</div>

          {/* <div>{moreFeeds}</div> */}
        </div>
    </div>
  ): (<div>loading...</div>));
}
