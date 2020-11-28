import React, { useEffect, useState } from "react";
import { localUrl, ec2Url } from "../config.js";
import "../css/AddArticle.css";
import { auth } from "../firebase.js";
import { useHistory } from "react-router-dom";
export default function AddArticle(props) {
  let history = useHistory();
  const [reqUrl, setReqUrl] = useState("");
  const [user, setUser] = useState("");
  useEffect(() => {
    setUser(props.user);
  }, [props.user]);
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
    <div className="addArticle">
      <input
        type="text"
        name="input"
        className="input"
        value={reqUrl}
        onChange={(e) => setReqUrl(e.currentTarget.value)}
      />
      <button
        type="submit"
        className="add"
        onClick={(e) => {
          postDataToServer(localUrl, {
            url: reqUrl,
            uid: user.uid,
          });
        }}
      >
        儲存文章
      </button>

      <br />
      {/* <a href="http://localhost:2000/route/article/before">Before</a>
      <br />
      <a href="http://localhost:2000/route/article/after">after</a>
      <br />
      <a href="http://localhost:2000/route/article/MD">Mark Down</a> */}
    </div>
  );
}
