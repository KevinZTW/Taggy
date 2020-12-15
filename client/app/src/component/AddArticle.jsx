import styles from "./AddArticle.module.css";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { localUrl, ec2Url } from "../config.js";
import { style } from "d3";

export default function AddArticle(props) {
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
          console.log(data);
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }
  return (
    <div className={styles.addArticle}>
      <div className={styles.title}>Import Article</div>
      <div className={styles.description}>Import the web content you love</div>
      <input
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
            postDataToServer(localUrl, {
              url: reqUrl,
              uid: user.uid,
            });
          }
        }}
      >
        Import Article
      </button>
      <button>Cancel</button>

      <br />
      {/* <a href="http://localhost:2000/route/article/before">Before</a>
      <br />
      <a href="http://localhost:2000/route/article/after">after</a>
      <br />
      <a href="http://localhost:2000/route/article/MD">Mark Down</a> */}
    </div>
  );
}
