// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
chrome.runtime.onMessage.addListener((request) => {
  console.log(request);
});
var db = firebase.firestore();
chrome.tabs.onActivated.addListener((tab) =>
  chrome.tabs.get(tab.tabId, (current_tab_info) => {
    console.log("Activate", current_tab_info.title);
    let title = current_tab_info.title;
    console.log(typeof title);
    console.dir(title);
  })
);

chrome.runtime.onMessage.addListener((request, sender, sendresponse) => {
  console.log("back get the message");
  // db.collection("Pages")
  //   .add({
  //     title: title,
  //     content: request.message,
  //   })
  //   .then(function () {
  //     console.log("Document successfully written!");
  //   })
  //   .catch(function (error) {
  //     console.error("Error writing document: ", error);
  //   });
});
