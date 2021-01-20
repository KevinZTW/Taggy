import { db } from "../server/models/firebase.js";
function killUserCleanDB(uid) {
  db.collection("Member")
    .doc(uid)
    .get()
    .then((doc) => {
      let boards = doc.data().board || [];
      let articleFolders = doc.data().articleFolders || [];
      let RSSFolders = doc.data().RSSFolders || [];
      let tags = doc.data().tags || [];
      if (boards[0]) {
        boards.forEach((board) => {
          console.log(board);
          db.collection("GroupBoard")
            .doc(board)
            .delete()
            .then(() => {
              console.log("groupboard", board, "be killed");
            })
            .catch((error) => {
              console.log("Error removing doc", error);
            });
        });
      }
      if (articleFolders[0]) {
        articleFolders.forEach((folder) => {
          db.collection("articleFolders")
            .doc(folder)
            .delete()
            .then(() => {
              console.log("articlefolder", folder, "be killed");
            })
            .catch((error) => {
              console.log("Error removing doc", error);
            });
        });
      }
      if (RSSFolders[0]) {
        RSSFolders.forEach((folder) => {
          db.collection("RSSFolders")
            .doc(folder)
            .delete()
            .then(() => {
              console.log("RSSFodler", folder, " be killed");
            })
            .catch((error) => {
              console.log("Error removing doc", error);
            });
        });
      }
      if (tags[0]) {
        tags.forEach((tag) => {
          db.collection("Tags")
            .doc(tag)
            .delete()
            .then(() => {
              console.log("tag", tag, "be killed");
            })
            .catch((error) => {
              console.log("Error removing doc", error);
            });
        });
      }
      return doc;
    })
    .then((doc) => {
      console.log(doc.data().displayname, "has been killed");
      doc.ref.delete();
    })
    .catch((error) => {
      console.log(error);
    });
}
function killDbArticles(uid) {
  db.collection("Articles")
    .where("uid", "", uid)
    .get()
    .then((snapShot) => {
      snapShot.forEach((doc) => {
        doc.ref.delete();
        console.log("article", doc.data().title, "be killed");
      });
    });
}
function tempkillDbArticles(uid) {
  db.collection("Articles")
    .where("uid", "not-in", [
      "OrMgy9fwIucYZPFEu5fsMOI6fHs1",
      "U8fx6rNCYSVxz38gdseSG2KEHfJ2",
    ])
    .get()
    .then((snapShot) => {
      snapShot.forEach((doc) => {
        doc.ref.delete();
        console.log("article", doc.data().title, "be killed");
      });
    });
}
tempkillDbArticles();

function cleanUsersData() {
  db.collection("Member")
    .get()
    .then((snapShot) => {
      snapShot.forEach((doc) => {
        let uid = doc.data().uid;
        console.log(uid);
        if (
          uid !== "U8fx6rNCYSVxz38gdseSG2KEHfJ2" &&
          uid !== "OrMgy9fwIucYZPFEu5fsMOI6fHs1"
        ) {
          console.log(uid);
          killDbArticles(uid);
          killUserCleanDB(uid);
        }
      });
    });
}

function killFeeds(RSSId) {
  db.collection("RSSItem")
    .where("RSSId", "==", "vJwY55oznp57CbRGdh1E")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.data());
        doc.ref.delete();
      });
    });
}
