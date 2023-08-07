import firebase from "firebase/app";
import "firebase/analytics";
import { useHistory } from "react-router-dom";
import "firebase/auth";
import "firebase/firestore";
var app = firebase.initializeApp({});
export const auth = app.auth();
export default app;
export var db = firebase.firestore();

//============================== Auth ============================================================

export function CheckFirebaseUserStatus(direct, getUserData) {
  const history = useHistory();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      if (getUserData) {
        getUserData({
          uid: user.uid,
          email: user.email,
          displayname: user.displayname,
          providerData: user.providerData,
        });
      }
    } else {
      history.push(direct);
    }
  });
}
