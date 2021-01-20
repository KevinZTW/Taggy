let app = {
  user: { boards: [], uid: "" },
  target: [],
};

app.Init = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendresponse) => {});
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      app.user.uid = user.uid;
    } else {
      window.location.replace("./signIn.html");
    }
  });
};
document.querySelector(".signout").addEventListener("click", () => {
  firebase.auth().signOut();
});
let save = document.querySelector(".save");

save.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "SAVEARTICLE",
      uid: app.user.uid,
    });
  });
});

app.getMemberGroup = (uid) => {
  return db
    .collection("Member")
    .doc(uid)
    .get()
    .then((doc) => {
      return doc.data().board;
    })
    .then((boards) => {
      return db
        .collection("GroupBoard")
        .where("id", "in", boards)
        .get()
        .then((snapShot) => {
          let boards = [];
          snapShot.forEach((doc) => {
            boards.push({
              name: doc.data().name,
              id: doc.data().id,
            });
          });

          return boards;
        });
    });
};
app.addSelect = (id, name) => {
  let wrapper = document.querySelector(".selectValue");
  let item = document.createElement("div");
  item.textContent = name;
  item.setAttribute("id", id);
  item.setAttribute("class", "value");
  wrapper.appendChild(item);
};

app.Init();
