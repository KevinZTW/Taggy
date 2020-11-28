import React, { useState } from "react";
import "../css/AddArticle.css";

const { addtofirestore } = require("../firebase.js");
export default function AddArticle() {
  const [reqUrl, setReqUrl] = useState("");

  function postData(url, data) {
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
          postData("http://localhost:2000/route/article/import", {
            url: reqUrl,
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
