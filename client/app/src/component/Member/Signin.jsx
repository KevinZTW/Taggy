import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../../css/App.css";
import styles from "../../css/SignUp.module.css";
import { Link } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { db, auth } from "../../firebase.js";
import firebase from "firebase/app";
export default function Signup() {
  const uiConfig = {
    callbacks: {
      signInSuccess: async function (authResult, redirectUrl) {
        console.log(authResult);
        let newUser = await db
          .collection("Member")
          .doc(authResult.uid)
          .get()
          .then((doc) => {
            if (doc.data()) {
              console.log("existing user sign in");
              return false;
            } else {
              console.log("new user! create it in db");
              return true;
            }
          });
        if (newUser) {
          await db
            .collection("Member")
            .doc(authResult.uid)
            .set({
              uid: authResult.uid,
              email: authResult.email,
              displaynamename: authResult.displayName,
            })

            .then(() => console.log("Add user to db successfully"))
            .then(history.push("board"))
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(errorMessage);
            });
        } else {
          console.log("exiting user signin");
        }
      },
    },
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.

    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let history = useHistory();
  function firebaseSignIn(email, password) {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log("you click sign in and successfully");
        history.push("/board");
        // Signed in
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  }
  return (
    <div className={styles.wrapper}>
      <div className="block" className={styles.block}>
        <h2 className={styles.title}>Sign In</h2>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            firebaseSignIn(email, password);
          }}
        >
          {/* <div className={styles.inputbox}>
            <label htmlFor="username">User Name</label>
            <input type="text" name="username" />
          </div> */}
          <div className={styles.inputbox}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
              }}
            />
          </div>
          <div className={styles.inputbox}>
            <label htmlFor="email">Password</label>
            <input
              type="password"
              name="passowrd"
              value={password}
              onChange={(e) => {
                setPassword(e.currentTarget.value);
              }}
            />
          </div>
          <button>Sign In</button>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </form>
      </div>
    </div>
  );
}
