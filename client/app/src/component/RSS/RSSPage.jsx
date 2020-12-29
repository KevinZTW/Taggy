import { Zoom } from "react-toastify";

import Tooltip from "@material-ui/core/Tooltip";
import { ec2Url } from "../../config.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
export default function RSSPage(props) {
  console.log("page rerender, props is ", props.item);
  const [feedItem, setFeedItem] = useState({});

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
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          notify_fail();
          return;
        }
        response.json().then(function (data) {
          console.log(data);
          notify_success();
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
        notify_fail();
      });
  }
  useEffect(() => {
    if (props.item) {
      setFeedItem(props.item);
    } else {
    }
  }, [props.item]);

  console.log(feedItem);
  let youtubeUrl = "";
  if (feedItem.media) {
    youtubeUrl = feedItem.media[0]["media:content"][0]["$"]["url"].replace(
      "https://www.youtube.com/v/",
      ""
    );
    console.log(feedItem.media[0]);
    console.log(feedItem.media[0]["media:thumbnail"][0]["$"]["url"]);
    console.log(feedItem.media[0]["media:content"][0]["$"]["url"]);
  }

  return (
    <div>
      {feedItem.media ? (
        <div className={styles.page}>
          <div className={styles.head}>
            <div className={styles.arrowWrapper}>
              <ArrowBack
                className={styles.Icon}
                style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                onClick={props.onClick}
              />
            </div>
            <CustomTooltip title="save to my board" placement="right" arrow>
              <div className={styles.arrowWrapper}>
                <BookmarkBorderIcon
                  className={styles.Icon}
                  style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                  onClick={() => {
                    postDataToServer(ec2Url, {
                      url: feedItem.link,
                      uid: user.uid,
                    });
                  }}
                />
              </div>
            </CustomTooltip>
          </div>
          <div className={styles.title}>{feedItem.title}</div>
          <iframe
            width="640"
            height="390"
            title="hihi"
            src={"https://www.youtube.com/embed/" + youtubeUrl}
          ></iframe>
          <div
            dangerouslySetInnerHTML={{
              __html: feedItem.content || feedItem["content:encoded"],
            }}
            className={styles.content}
          ></div>
        </div>
      ) : (
        <div className={styles.page}>
          <div className={styles.head}>
            <div className={styles.arrowWrapper}>
              <ArrowBack
                className={styles.Icon}
                style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                onClick={props.onClick}
              />
            </div>
            <CustomTooltip title="save to my board" placement="right" arrow>
              <div className={styles.arrowWrapper}>
                <BookmarkBorderIcon
                  className={styles.Icon}
                  style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                  onClick={() => {
                    postDataToServer(ec2Url, {
                      url: feedItem.link,
                      uid: user.uid,
                    });
                  }}
                />
              </div>
            </CustomTooltip>
          </div>
          <div className={styles.title}>{feedItem.title}</div>
          <div
            dangerouslySetInnerHTML={{
              __html: feedItem.content || feedItem["content:encoded"],
            }}
            className={styles.content}
          ></div>
        </div>
      )}
    </div>
  );
}
