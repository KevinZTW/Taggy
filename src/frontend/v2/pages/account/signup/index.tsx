import React, { useState } from "react";
import { toast } from "react-toastify";
import logo from "@/public/imgs/taggy_logo_1x.png";

import { AccountService } from "@/services/AccountService";

import styles from "./index.module.css";
import  Link  from "next/link";
import { useRouter } from "next/router";


export default function signup() {
  const notify_fail = (code : String) => {
    let message = "";
    switch (code) {
      case AuthErrorCodes.INVALID_EMAIL:
        message = "Hey that's invalid email address";
        break;
      case AuthErrorCodes.EMAIL_EXISTS:
        message = "Email already in use";
        break;
      case AuthErrorCodes.WEAK_PASSWORD:
        message = "Sorry... password should be at least 6 characters";
        break;
      default:  
        message = "Sign in fail, please check your account and password";
    }
    toast.warn(

      <div> {message} </div>,
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
  }
  
  const [name, setName] = useState("user");
  const [email, setEmail] = useState("user@gmail.com");
  const [password, setPassword] = useState("123123");


  let router = useRouter();

  function signup(name:string, email: string, password: string) {

    let accountService = AccountService();
    accountService.signup(name, email, password)
    .then(() => {
      accountService.getToken(email, password)
    }).then(() => {
      router.push("/rss/latest");
    })
    
    .catch((e) => {
      console.log(e.message);
      notify_fail(e.code);
    });
}

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
        <div className={styles.block}>
          <h2 className={styles.title}>Sign Up</h2>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              signup(name, email, password);
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
          <div className={styles.login}>
            <span>Already have an account? </span>
            <Link href={"/account/signin"}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
