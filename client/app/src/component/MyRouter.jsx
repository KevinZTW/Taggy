import React from "react";
import { useEffect } from "react";
import { auth } from "../firebase.js";
import { useDispatch } from "react-redux";
import { SETMEMBER } from "../redux/actions";
import { useHistory, useLocation } from "react-router-dom";
export default function MyRouter() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // setUser(user);
        dispatch(SETMEMBER(user.uid, user.displayName, user.email));
        // history.push("/home");
      } else {
        if (location.pathname !== "/" && location.pathname !== "/signin")
          history.push("/signup");
      }
    });
  }, [dispatch, history]);

  return <div></div>;
}
