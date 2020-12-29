let app = {
  user: { boards: [], uid: "" },
  target: [],
};

app.Init = () => {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      app.user.uid = user.uid;
      app.user.boards = await app.getMemberGroup(user.uid);
      let boards = app.user.boards;
      let selectOption = document.querySelector(".selectOption");

      function createMyBoard() {
        let item = document.createElement("div");
        item.textContent = "My Board";
        item.setAttribute("id", user.uid);
        item.setAttribute("class", "option");
        item.addEventListener("click", () => {
          app.addSelect(user.uid, "My Board");
          app.target.push(user.uid);
        });
        selectOption.appendChild(item);
      }
      createMyBoard();
      boards.forEach((board) => {
        let item = document.createElement("div");
        item.textContent = board.name;
        item.setAttribute("id", board.id);
        item.setAttribute("class", "option");
        item.addEventListener("click", () => {
          app.addSelect(board.id, board.name);
          app.target.push(board.id);
        });
        selectOption.appendChild(item);
      });
    } else {
      window.location.replace("./signIn.html");
    }
  });
};
document.querySelector(".signout").addEventListener("click", () => {
  firebase.auth().signOut();
});
let save = document.querySelector(".save");
// let fullPageContent = document.querySelector("html");

save.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "SAVEARTICLE",
      uid: app.target,
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
