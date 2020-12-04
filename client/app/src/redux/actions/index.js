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

export { INITARTICLE, SWITCHARTICLE, SETMEMBER, GETRSSRESPONSE };
