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
          dispatch(GETRSSRESPONSE(data.feed, ""));
          setLoading(false);
          props.showChannel();
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
      <div className={styles.addTitle}>
        Try tech keyword in Mandarin / English here!
      </div>
    </div>
  );
}
