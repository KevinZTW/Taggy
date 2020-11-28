import firebase from "firebase";
import { firebaseConfig } from "./configx.js";

var app = firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

const auth = app.auth();

export { db, auth };
