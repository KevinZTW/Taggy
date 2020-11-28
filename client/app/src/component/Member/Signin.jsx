import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../../css/App.css";
import styles from "../../css/SignUp.module.css";
import { Link } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { uiConfig, auth } from "../../firebase.js";
export default function Signup() {
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
        </form>
      </div>
    </div>
  );
}
