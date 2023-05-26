var firebaseConfig = {
  apiKey: "AIzaSyA4cFmihlY5pIDTssbGwk9YNfGEjRfEBh4",
  authDomain: "knowledge-base-tw.firebaseapp.com",
  databaseURL: "https://knowledge-base-tw.firebaseio.com",
  projectId: "knowledge-base-tw",
  storageBucket: "knowledge-base-tw.appspot.com",
  messagingSenderId: "786102856750",
  appId: "1:786102856750:web:6bf12efd1fefb24aca83bf",
  measurementId: "G-RBNFGWQ2WE",
};
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;

    window.location.replace("./pop.html");
  } else {
  }
});

document.querySelector(".signin").addEventListener("click", () => {
  let account = document.querySelector(".account").value;
  let password = document.querySelector(".password").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(account, password)
    .then((user) => {
      alert("you click sign in and successfully");
      // Signed in
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode);
      alert(errorMessage);
    });
});

const ui = new firebaseui.auth.AuthUI(firebase.auth());

const uiConfig = {
  callbacks: {
    signInFailure: function (error) {
      alert(error);
    },
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.

      window.location.replace("./main.html");
      return true;
    },
    uiShown: function () {
      document.getElementById("loader").style.display = "none";
    },
  },
  signInFlow: "popup",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

ui.start("#firebaseui-auth-container", uiConfig);
