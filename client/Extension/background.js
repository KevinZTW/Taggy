import {host} from "../config"

let user_signed_in = false;
let uid;
let articleApiUrl = "https://www.shopcard.site/route/article/import";
let app = {};
app.postDataToServer = function (
  url,
  data = {
    url: "www.sylish.com",
    uid: "12344",
  }
) {
  console.log(url);
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
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              msg: "SAVESUCCESS",
            });
          }
        );
        chrome.runtime.sendMessage({
          msg: "SAVESUCCESS",
        });
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
};

var firebaseConfig = {
  apiKey: "AIzaSyA4cFmihlY5pIDTssbGwk9YNfGEjRfEBh4",
  authDomain: "knowledge-base-tw.firebaseapp.com",
  databaseURL: "https://knowledge-base-tw.firebaseio.com",
  projectId: "knowledge-base-tw",
  storageBucket: "knowledge-base-tw.appspot.com",
  messagingSenderId: "786102856750",
  appId: "1:786102856750:web:6bf12efd1fefb24aca83bf",
  measurementId: "G-RBNFGWQ2WE",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function (user) {
    console.log(
      "User state change detected from the Background script of the Chrome Extension:",
      user.uid
    );
    uid = user.uid;
    user_signed_in = true;
  });
}

var db = firebase.firestore();
db.collection("Member")
  .get()
  .then((snap) => {
    console.log("hihi");
    snap.forEach((doc) => {
      console.log(doc.data());
    });
  });
// chrome.tabs.onActivated.addListener((tab) =>
//   chrome.tabs.get(tab.tabId, (current_tab_info) => {
//     console.log("Activate", current_tab_info.title);
//   })
// );

chrome.runtime.onMessage.addListener((request, sender, sendresponse) => {
  console.log("back get the message");
  switch (request.action) {
    case "SAVEARTICLE": {
      if (uid) {
        app.postDataToServer(
          articleApiUrl,
          (data = {
            url: request.url,
            uid: request.uid,
          })
        );
        sendresponse({
          msg: "success send content to backend ",
        });
      }
    }
    case "signout": {
      user_signed_in = false;
      sendresponse({
        msg: "success",
      });
    }
  }
});
window.onload = function () {
  initApp();
};
