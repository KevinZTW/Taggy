import React, { useState } from "react";
import logo from "../../imgs/taggy_logo_1x.png";
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
        const newUser = await db
          .collection("Member")
          .doc(authResult.uid)
          .get()
          .then((doc) => {
            if (doc.data()) {
              return false;
            } else {
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
            .then(() => {
              fetch("https://www.shopcard.site/route/user/syncuser");
            })

            .then(history.push("home"));
        } else {
          history.push("home");
        }
      },
    },

    signInFlow: "popup",

    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function firebaseSignUp(name, email, password) {
    auth.createUserWithEmailAndPassword(email, password).then((user) => {
      db.collection("Member")
        .doc(user.user.uid)
        .set({
          displaynamename: name,
          email: email,
          password: password,
          uid: user.user.uid,
        })
        .then(() => {
          var user = auth.currentUser;

          user.updateProfile({
            displayName: name,
          });
          fetch("https://www.shopcard.site/route/user/syncuser");
        })
        .then(history.push("/home"));
    });
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.headWrapper}>
        <Link to={"/"}>
          <div className={styles.homeWrapper}>
            <div className={styles.logoWrapper}>
              <img src={logo} alt="" />
            </div>
            <div className={styles.logoTitle}>Taggy</div>
          </div>
        </Link>
        <Link to={"/signin"} className={styles.logInWrapper}>
          <div className={styles.logInBtn}>Login</div>
        </Link>
        <Link to={"/signup"}>
          <div className={styles.SignUpBtn}>Sign up</div>
        </Link>
      </div>
      <div className={styles.blockWrapper}>
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
            <Link to={"/Signin"}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
