import { Zoom } from "react-toastify";

import Tooltip from "@material-ui/core/Tooltip";
import RSSCard from "../RSS/RSSCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Chip } from "@material-ui/core";
import { toast } from "react-toastify";
import ArrowBack from "@material-ui/icons/ArrowBack";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import styles from "./RSSPage.module.css";

import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import { withStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    color: "white",
    fontFamily: "Open Sans",
    fontSize: 14,
  },
}))(Tooltip);

export default function RSSPage({ item, onClick }) {
  const [tagRecoms, setTagRecoms] = useState([]);
  const [newItem, setNewItem] = useState([]);

  useEffect(() => {
    async function getFeedTagsRecommend(feedId) {
      const response = await fetch(
        `https://www.shopcard.site/route/rss/feedtags?feedid=${feedId}`
      );
      return response.json();
    }
    function setFeedTagRecommend(data) {
      console.log(data);
      setTagRecoms(data);
    }
    getFeedTagsRecommend(newItem.FeedId || item.id).then(setFeedTagRecommend);
  }, [newItem]);

  function renderFeedTags(tags) {
    const tagChips = [];
    if (tags) {
      tags.forEach((tag) => {
        console.log(tag);
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
        console.log(feed);
        moreFeeds.push(
          <RSSCard
            item={feed}
            onClick={() => {
              setNewItem(feed);
              console.log("hihihihi");
              document
                .querySelector("#RSSPage")
                [`scrollTo`]({ top: 0, behavior: `smooth` });
            }}
          />
        );
      });
    }
    return moreFeeds;
  }
  const notify_success = () =>
    toast.dark(
      <div className="toastBody">
        <BookmarkBorderOutlinedIcon
          style={{ color: "rgba(255,255,255, 0.6)" }}
        />
        <div className="toastText">
          Saved to<strong> My Board </strong>
          <Link to="/board">
            <strong>View item</strong>
          </Link>
        </div>
      </div>,

      {
        position: "top-center",
        autoClose: 5000,
        transition: Zoom,
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
  const user = useSelector((state) => {
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
          notify_fail();
          return;
        }
        response.json().then(function (data) {
          //console.log(data);
          notify_success();
        });
      })
      .catch(function (err) {
        //console.log("Fetch Error :-S", err);
        notify_fail();
      });
  }

  let youtubeUrl = "";
  if (item.media) {
    youtubeUrl = item.media[0]["media:content"][0]["$"]["url"].replace(
      "https://www.youtube.com/v/",
      ""
    );
  }
  const tagChips = renderFeedTags(tagRecoms.tags);
  const moreFeeds = renderMoreFeeds(tagRecoms.feeds);
  return (
    <div>
      {item.media ? (
        <div className={styles.page} id="RSSPage">
          <div className={styles.head}>
            <div className={styles.arrowWrapper}>
              <ArrowBack
                className={styles.Icon}
                style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                onClick={onClick}
              />
            </div>
            <CustomTooltip title="save to my board" placement="right" arrow>
              <div className={styles.arrowWrapper}>
                <BookmarkBorderIcon
                  className={styles.Icon}
                  style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                  onClick={() => {
                    postDataToServer(
                      "https://www.shopcard.site/route/article/import",
                      {
                        url: newItem.link || item.link,
                        uid: user.uid,
                      }
                    );
                  }}
                />
              </div>
            </CustomTooltip>
          </div>
          <div className={styles.title}>{newItem.title || item.title}</div>
          {tagChips}
          <iframe
            width="640"
            height="390"
            title="hihi"
            src={"https://www.youtube.com/embed/" + youtubeUrl}
          ></iframe>
          <div
            dangerouslySetInnerHTML={{
              __html:
                newItem.content || item.content || item["content:encoded"],
            }}
            className={styles.content}
          ></div>
        </div>
      ) : (
        <div className={styles.page} id="RSSPage">
          <div className={styles.head}>
            <div className={styles.arrowWrapper}>
              <ArrowBack
                className={styles.Icon}
                style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                onClick={onClick}
              />
            </div>
            <CustomTooltip title="save to my board" placement="right" arrow>
              <div className={styles.arrowWrapper}>
                <BookmarkBorderIcon
                  className={styles.Icon}
                  style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                  onClick={() => {
                    postDataToServer(
                      "https://www.shopcard.site/route/article/import",
                      {
                        url: newItem.link || item.link,
                        uid: user.uid,
                      }
                    );
                  }}
                />
              </div>
            </CustomTooltip>
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
      )}
    </div>
  );
}
