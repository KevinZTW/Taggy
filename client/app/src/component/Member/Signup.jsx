import React, { useState } from "react";
import "../../css/App.css";
import styles from "../../css/SignUp.module.css";
import { Link } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../../firebase.js";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { db } from "../../firebase";
export default function Signup() {
  const uiConfig = {
    callbacks: {
      signInSuccess: async function (authResult, redirectUrl) {
        console.log(authResult.uid);
        console.log(redirectUrl);
        await db
          .collection("Member")
          .doc(authResult.uid)
          .set({
            uid: authResult.uid,
            email: authResult.email,
            displaynamename: authResult.displayName,
          })

          .then(() => console.log("Add user to db successfully"))

          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
          });
      },
    },
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.

    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };
  const history = useHistory();
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  function firebaseSignUp(name, email, password) {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user.user);
        db.collection("Member").doc(user.user.uid).set({
          displaynamename: name,
          email: email,
          password: password,
          uid: user.user.uid,
        });
      })
      .then(() => {
        var user = auth.currentUser;
        user
          .updateProfile({
            displayName: name,
          })
          .then(() => console.log("update user name successfully"));
      })
      .then(history.push("/board"))
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <h2 className={styles.title}>Sign Up</h2>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            firebaseSignUp(name, email, password);
          }}
        >
          <div className={styles.inputbox}>
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              name="username"
              value={name}
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            />
          </div>
          <div className={styles.inputbox}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
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
          <button>Sign Up</button>
        </form>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        <div className={styles.login}>
          <span>Already have an account? </span>
          <Link to={"/Signin"}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
