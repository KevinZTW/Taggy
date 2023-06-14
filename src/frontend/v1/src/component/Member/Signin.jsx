import React, { useState } from "react";
import { toast } from "react-toastify";
import logo from "../../imgs/taggy_logo_1x.png";
import { useHistory } from "react-router-dom";
import "../../css/App.css";
import styles from "../../css/SignUp.module.css";
import { Link } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { db, auth } from "../../firebase.js";
import firebase from "firebase/app";
import {host} from "../../config"
export default function Signup() {
  const notify_fail = () =>
    toast.warn(
      <div>Sign in fail, please check your account and password</div>,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
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
              fetch(host + "/route/user/syncuser");
            })
            .then(history.push("home"))
            .catch((error) => {
              notify_fail();
            });
        } else {
          history.push("home");
        }
      },
    },

    signInFlow: "popup",

    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };
  const [email, setEmail] = useState("user@gmail.com");
  const [password, setPassword] = useState("123123");
  const history = useHistory();
  function firebaseSignIn(email, password) {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        history.push("/home");
      })
      .catch(() => {
        notify_fail();
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
        <div className="block">
          <h2 className={styles.title}>Login</h2>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              firebaseSignIn(email, password);
            }}
          >
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
                placeholder="123123"
                value={password}
                onChange={(e) => {
                  setPassword(e.currentTarget.value);
                }}
              />
            </div>
            <div
              className={styles.demoBtn}
              onClick={() => {
                firebaseSignIn("user@gmail.com", "123123");
              }}
            >
              Try with demo account
            </div>
            <button>Login</button>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
          </form>
        </div>
      </div>
    </div>
  );
}
