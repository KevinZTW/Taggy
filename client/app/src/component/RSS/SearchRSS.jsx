import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import styles from "./FindRSS.module.css";

import LinearProgress from "@material-ui/core/LinearProgress";
import { GETRSSRESPONSE } from "../../redux/actions";

export default function FindRSS(props) {
  const [reqUrl, setReqUrl] = useState("appworks");
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
  function searchRSS(keyWord) {
    setLoading(true);
    fetch("https://www.shopcard.site/route/rss/search", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyWord: keyWord }),
    }).then((response) => {
      if (response.status !== 200) {
        notify_fail();
        return;
      } else {
        response.json().then(function (data) {
          //console.log(data.feed);
          dispatch(GETRSSRESPONSE(data.feed, ""));
          setLoading(false);
          props.showChannel();
        });
      }
    });

    // parser.parseURL(CORS_PROXY + url, function (err, feed) {
    //   if (err) {
    //     //console.log("error, refetch from nbackend");
    //     fetch("https://www.shopcard.site/route/" + "rss/fetch", {
    //       method: "post",
    //       headers: {
    //         "Content-Type": "application/json",
    //         // 'Content-Type': 'application/x-www-form-urlencoded',
    //       },
    //       body: JSON.stringify({ url: url }),
    //     }).then(function (response) {
    //       if (response.status !== 200) {
    //         //console.log("sth goes wrong in backend ");
    //         notify_fail();
    //       } else {
    //         response.json().then((data) => {
    //           dispatch(GETRSSRESPONSE(data.rss, url));
    //           setLoading(false);
    //           props.showChannel();
    //         });
    //       }
    //     });
    //   } else {
    //     props.showChannel();
    //     //console.log(feed.title);
    //     dispatch(GETRSSRESPONSE(feed, url));
    //     setLoading(false);
    //     feed.items.forEach(function (entry) {
    //       //console.log(entry.title + ":" + entry.link);
    //     });
    //   }
    // });
  }

  return (
    <div className={styles.addArticle}>
      <form
        className={styles.addForm}
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          if (user) {
            searchRSS(reqUrl);
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
          Search
        </button>
      </form>
      {loading ? <LinearProgress className={styles.progress} /> : ""}
      <br />
      <div class={styles.addTitle}>
        Try tech keyword in Mandarin / English here!
      </div>
    </div>
  );
}
