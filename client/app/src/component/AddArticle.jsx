import styles from "./AddArticle.module.css";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function AddArticle(props) {
  const [loading, setLoading] = useState(false);
  const [reqUrl, setReqUrl] = useState("");
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
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
  function postDataToServer(
    url,
    data = {
      url: "www.sylish.com",
      uid: "12344",
    }
  ) {
    setLoading(true);
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
        } else {
          response.json().then(function (data) {
            if (data.msg === "data sucessfully save in backend") {
              setTimeout(props.close, 2500);
            } else {
            }
          });
        }
      })
      .catch(function (err) {
        notify_fail();
      });
  }
  return (
    <div className={styles.addArticle}>
      <div className={styles.title}>Import article </div>
      <div className={styles.description}>
        Enter the url, we would clip and save the website content
      </div>
      <input
        placeholder="https://www....."
        type="text"
        name="input"
        className={styles.input}
        value={reqUrl}
        onChange={(e) => setReqUrl(e.currentTarget.value)}
      />
      <button
        type="submit"
        className={styles.add}
        onClick={(e) => {
          if (user) {
            e.preventDefault();
            postDataToServer("https://www.shopcard.site/route/article/import", {
              url: reqUrl,
              uid: user.uid,
            });
          }
        }}
      >
        Import
      </button>
      {/* <button className={styles.cancel} onClick={props.close}>
        Cancel
      </button> */}

      <br />
      <br />
      {loading ? <LinearProgress /> : ""}
    </div>
  );
}
