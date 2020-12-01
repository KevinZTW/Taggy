import firebase from "firebase/app";
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
import { useHistory } from "react-router-dom";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

var app = firebase.initializeApp({
  apiKey: "AIzaSyA4cFmihlY5pIDTssbGwk9YNfGEjRfEBh4",
  authDomain: "knowledge-base-tw.firebaseapp.com",
  databaseURL: "https://knowledge-base-tw.firebaseio.com",
  projectId: "knowledge-base-tw",
  storageBucket: "knowledge-base-tw.appspot.com",
  messagingSenderId: "786102856750",
  appId: "1:786102856750:web:6bf12efd1fefb24aca83bf",
  measurementId: "G-RBNFGWQ2WE",
});
export const auth = app.auth();
export default app;
export var db = firebase.firestore();

export const deleteArticle = function (id) {
  console.log(id);
  db.collection("Articles")
    .doc(id)
    .delete()
    .then(console.log("Document successfully deleted!"))
    .catch(function (error) {
      console.error("Error delete document: ", error);
    });
};

//============================== Auth ============================================================
export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/board",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};
export function CheckFirebaseUserStatus(direct, getUserData) {
  let history = useHistory();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
      if (getUserData) {
        getUserData({
          uid: user.uid,
          email: user.email,
          displayname: user.displayname,
          providerData: user.providerData,
        });
      }
    } else {
      console.log("no user, redirect to sign up");
      history.push(direct);
    }
  });
}
