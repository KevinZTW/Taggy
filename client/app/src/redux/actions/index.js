const SETMEMBER = (uid, displayName, email) => {
  return {
    type: "SETMEMBER",
    uid: uid,
    displayName: displayName,
    email: email,
  };
};

const INITARTICLE = (articleList) => {
  return {
    type: "INITARTICLE",
    articleList: articleList,
  };
};

const SWITCHARTICLE = (tag) => {
  return {
    type: "SWITCHARTICLE",
    tagSelected: tag,
  };
};

const GETRSSRESPONSE = (feed, url) => {
  return {
    type: "GETRSSRESPONSE",
    url: url,
    feed: feed,
  };
};

// const INITRSS = (articleList) => {
//   return {
//     type: "INITRSS",
//     articleList: articleList,
//   };
// };
const SWITCHRSS = (ChannelRSSId) => {
  console.log("hihi");
  return {
    type: "SWITCHRSS",
    ChannelRSSId: ChannelRSSId,
  };
};
export { INITARTICLE, SWITCHRSS, SWITCHARTICLE, SETMEMBER, GETRSSRESPONSE };
