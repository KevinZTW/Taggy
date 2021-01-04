import { connection } from "./mysqlconfig.js";
import { db } from "./firebaseconfig.js";

function syncUser() {
  db.collection("Member")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const sqlCheck = `SELECT * FROM User WHERE UserUID = "${
          doc.data().uid
        }";`;

        connection.query(sqlCheck, (error, result) => {
          if (result[0] !== undefined) {
            console.log(` User ${doc.data().displaynamename} exist`);
          } else {
            let { displaynamename, uid, email } = doc.data();
            const sql = `INSERT INTO User (UserUID, DisplayName, Email) VALUES ('${uid}','${displaynamename}','${email}');`;
            connection.query(sql, function (error, results, fields) {
              if (error) {
                console.log(error);
              } else {
                console.log("succesfully add User", uid);
              }
            });
          }
        });
      });
    });
}
syncUser();

function syncRSS() {
  db.collection("RSSFetchList")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const sqlCheck = `SELECT * FROM RSS WHERE RSSId = '${doc.data().id}';`;

        connection.query(sqlCheck, (error, result) => {
          if (result[0] !== undefined) {
            console.log(` RSS${doc.data().title} exist`);
          } else {
            const sql = `INSERT INTO RSS (RSSId, RSSName, RSSDescription, RSSUrl,RSSLASTUPDATE ,RSSImg) VALUES ('${
              doc.data().id
            }','${doc
              .data()
              .title.replace(/'/gi, "''")}','${doc
              .data()
              .description.replace(/'/gi, "''")}','${doc.data().url}','${
              doc.data().lastUpdate
            }','${doc.data().img}');`;
            connection.query(sql, function (error, results, fields) {
              if (error) {
                console.log(error);
              } else {
                console.log("succesfully add RSS", doc.data().title);
              }
            });
          }
        });
      });
    });
}

function syncUserRSSSubscription() {
  db.collection("Member")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        let userUID = doc.data().uid;
        let RSSusbscription = doc.data().subscribedRSS;
        const sqlClean = `DELETE FROM UserSubscription WHERE UserUID='${userUID}'`;
        connection.query(sqlClean, (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
            if (RSSusbscription) {
              RSSusbscription.forEach((RSSId) => {
                const sql = `INSERT INTO UserSubscription (UserUID,RSSID) VALUE ('${userUID}','${RSSId}')`;
                connection.query(sql, (error, result) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(result);
                  }
                });
              });
            }
          }
        });

        const sqlCheck = `SELECT * FROM User WHERE UserUID = "${
          doc.data().id
        }";`;

        connection.query(sqlCheck, (error, result) => {
          if (result[0] !== undefined) {
            console.log(` User ${doc.data().title} exist`);
          } else {
            let { displaynamename, uid, email } = doc.data();
            const sql = `INSERT INTO User (UserUID, DisplayName, Email) VALUES ('${uid}','${displaynamename}','${email}');`;
            connection.query(sql, function (error, results, fields) {
              if (error) {
                console.log(error);
              } else {
                console.log("succesfully add User", uid);
              }
            });
          }
        });
      });
    });
}

function syncFeeds() {
  db.collection("RSSItem")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.data().content !== undefined) {
          console.log(doc.data().id, doc.data().title);
          const sqlCheck = `SELECT * FROM Feed WHERE FeedId = "${
            doc.data().id
          }";`;

          connection.query(sqlCheck, (error, result) => {
            if (result[0] !== undefined) {
              console.log(`-Feed ${doc.data().title} exist`);
            } else {
              console.log(`-Feed ${doc.data().title} not exist, add to DB`);
              console.log(doc.data().id);
              const sql = `INSERT INTO Feed (FeedId, RSSId, FeedTitle,FeedContent, FeedContentSnippet,FeedGuid, FeedPubDate,FeedLink ) VALUES ('${
                doc.data().id
              }','${doc.data().RSSId}','${doc
                .data()
                .title.replace(/'/gi, "''")}','${doc
                .data()
                .content.replace(
                  /'/gi,
                  "''"
                )}','${doc.data().contentSnippet.replace(/'/gi, "''")}','${
                doc.data().guid
              }','${doc.data().pubDate}','${doc.data().link}');`;
              connection.query(sql, function (error, results, fields) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("succesfully add Feed", doc.data().title);
                }
              });
            }
          });
        }
      });
    });
}
function syncArticles() {
  db.collection("Articles")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.data().content !== undefined) {
          console.log(doc.data().id, doc.data().title);
          const sqlCheck = `SELECT * FROM Feed WHERE FeedId = "${
            doc.data().id
          }";`;

          connection.query(sqlCheck, (error, result) => {
            if (result[0] !== undefined) {
              console.log(`-Feed ${doc.data().title} exist`);
            } else {
              console.log(`-Feed ${doc.data().title} not exist, add to DB`);
              console.log(doc.data().id);
              const sql = `INSERT INTO Feed (FeedId, RSSId, FeedTitle,FeedContent, FeedContentSnippet,FeedGuid, FeedPubDate,FeedLink ) VALUES ('${
                doc.data().id
              }','${doc.data().RSSId}','${doc
                .data()
                .title.replace(/'/gi, "''")}','${doc
                .data()
                .content.replace(
                  /'/gi,
                  "''"
                )}','${doc.data().contentSnippet.replace(/'/gi, "''")}','${
                doc.data().guid
              }','${doc.data().pubDate}','${doc.data().link}');`;
              connection.query(sql, function (error, results, fields) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("succesfully add Feed", doc.data().title);
                }
              });
            }
          });
        }
      });
    });
}

export const Sync = {
  Feeds: syncFeeds,
  RSS: syncRSS,
  User: syncUser,
  UserRSSSubscription: syncUserRSSSubscription,
};
