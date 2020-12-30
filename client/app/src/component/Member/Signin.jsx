import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import logo from "../../imgs/taggy_logo_1x.png";
import { useHistory } from "react-router-dom";
import "../../css/App.css";
import styles from "../../css/SignUp.module.css";
import { Link } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { db, auth } from "../../firebase.js";
import firebase from "firebase/app";
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
        //console.log(authResult);
        const newUser = await db
          .collection("Member")
          .doc(authResult.uid)
          .get()
          .then((doc) => {
            if (doc.data()) {
              //console.log("existing user sign in");
              return false;
            } else {
              //console.log("new user! create it in db");
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

            .then(history.push("home"))
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              notify_fail();
            });
        } else {
          history.push("home");
          //console.log("exiting user signin");
        }
      },
    },
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.

    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  function firebaseSignIn(email, password) {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        //console.log("you click sign in and successfully");
        history.push("/home");
        // Signed in
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.log(errorCode);
        //console.log(errorMessage);
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
    </div>
  );
}
