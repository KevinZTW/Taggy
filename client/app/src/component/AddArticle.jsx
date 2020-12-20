import styles from "./AddArticle.module.css";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import { localUrl, ec2Url } from "../config.js";
import { style } from "d3";

export default function AddArticle(props) {
  const [loading, setLoading] = useState(false);
  const [reqUrl, setReqUrl] = useState("");
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
          return;
        }
        response.json().then(function (data) {
          if (data.msg === "data sucessfully save in backend") {
            props.close();
          } else {
          }
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
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
            postDataToServer(ec2Url, {
              url: reqUrl,
              uid: user.uid,
            });
          }
        }}
      >
        Import
      </button>
      <button className={styles.cancel} onClick={props.close}>
        Cancel
      </button>

      <br />
      <br />
      {loading ? <LinearProgress /> : ""}
    </div>
  );
}
