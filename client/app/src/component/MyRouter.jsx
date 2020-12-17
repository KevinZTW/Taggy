import { Divider } from "material-ui";
import React from "react";
import { useEffect } from "react";
import { auth } from "../firebase.js";
import { useDispatch, useSelector } from "react-redux";
import { SETMEMBER } from "../redux/actions";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
export default function MyRouter() {
  let dispatch = useDispatch();

  const history = useHistory();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        // setUser(user);
        dispatch(SETMEMBER(user.uid, user.displayName, user.email));
        history.push("/home");
      } else {
        history.push("/signup");
      }
    });
  }, [dispatch, history]);

  return <div></div>;
}
