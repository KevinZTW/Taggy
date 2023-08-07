import React, { useState } from "react";
import { toast } from "react-toastify";
import logo from "@/public/imgs/taggy_logo_1x.png";

import Cookie from "@/utils/Cookie";

import styles from "./index.module.css";
import  Link  from "next/link";
import { useRouter } from "next/router";
import { AccountService } from "@/services/AccountService";


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


  let router = useRouter();
  let accountService = AccountService();

  function firebaseSignIn(email: string, password: string) {
    accountService.getToken(email, password).then((token) => {
      console.log(token);
      // router.push("/rss/latest");
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
    


  }

    
//   const uiConfig = {
//     callbacks: {
//       signInSuccess: async function (authResult, redirectUrl) {
//         const uid = authResult.uid;
//         const email = authResult.email;
//         const displayName = authResult.displayName;
//         console.log(authResult);
//         //TODO: check if user exist??
//         //TODO: redirect to home page
        
//       },
//     },

//     signInFlow: "popup",
//     signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
//   };
  const [email, setEmail] = useState("user@gmail.com");
  const [password, setPassword] = useState("123123");
//   const history = useHistory();

  
  return (
    <div className={styles.wrapper}>
      <div className={styles.headWrapper}>
        <Link href={"/"}>
          <div className={styles.homeWrapper}>
            <div className={styles.logoWrapper}>
              <img src={logo.src} alt="" />
            </div>
            <div className={styles.logoTitle}>Taggy</div>
          </div>
        </Link>
        <Link href={"/account/signin"} className={styles.logInWrapper}>
          <div className={styles.logInBtn}>Login</div>
        </Link>
        <Link href={"/account/signup"}>
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
              Play with our demo accout
            </div>
            <button>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
