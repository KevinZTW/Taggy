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

const INITUSERRSSLIST = (RSSList) => {
  return {
    type: "INITUSERRSSLIST",
    RSSList: RSSList,
  };
};

const GROUPINIT = (groups) => {
  return {
    type: "GROUPINIT",
    groups: groups,
  };
};
const INITGROUPSELECT = (groupId, groupName) => {
  return {
    type: "INITGROUPSELECT",
    groupId: groupId,
    groupName: groupName,
  };
};
const SWITCHGROUPSELECT = (groupId, groupName) => {
  return {
    type: "SWITCHGROUPSELECT",
    groupId: groupId,
    groupName: groupName,
  };
};

// const INITGROUPARTICLE = (articleList) => {
//   return {
//     type: "INITGROUPARTICLE",
//     articleList: articleList,
//   };
// };
// const SWITCHGROUPARTICLE = (tag) => {
//   return {
//     type: "SWITCHGROUPARTICLE",
//     tagSelected: tag,
//   };
// };

export {
  // SWITCHGROUPARTICLE,
  INITARTICLE,
  SWITCHRSS,
  SWITCHARTICLE,
  SETMEMBER,
  GETRSSRESPONSE,
  INITUSERRSSLIST,
  GROUPINIT,
  // INITGROUPARTICLE,
  SWITCHGROUPSELECT,
  INITGROUPSELECT,
};
