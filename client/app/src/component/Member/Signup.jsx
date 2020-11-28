import React, { useState } from "react";
import "../../css/App.css";
import styles from "../../css/SignUp.module.css";
import { Link } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { uiConfig, auth } from "../../firebase.js";
import { useHistory } from "react-router-dom";
export default function Signup() {
  const history = useHistory();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  function firebaseSignUp(email, password) {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        // Signed in
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
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
            firebaseSignUp(email, password);
          }}
        >
          <div className={styles.inputbox}>
            <label htmlFor="username">User Name</label>
            <input type="text" name="username" />
          </div>
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
