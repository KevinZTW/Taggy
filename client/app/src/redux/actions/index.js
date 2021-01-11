const SETMEMBER = (uid, displayName, email) => {
  return {
    type: "SETMEMBER",
    uid: uid,
    displayName: displayName,
    email: email,
  };
};

const ADDFETCHARTICLE = (articleList, lastQuery) => {
  return {
    type: "ADDFETCHARTICLE",
    articleList: articleList,
    lastQuery: lastQuery,
  };
};
const SWITCHARTICLEFETCH = (fetchRequired) => {
  return {
    type: "SWITCHARTICLEFETCH",
    fetchRequired: fetchRequired,
  };
};
const RESETARTICLEFETCH = () => {
  return {
    type: "RESETARTICLEFETCH",
  };
};
const INITARTICLEFOLDERS = (articleFolders) => {
  return {
    type: "INITARTICLEFOLDERS",
    articleFolders: articleFolders,
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

const SWITCHRSS = (ChannelRSSId) => {
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

export {
  ADDFETCHARTICLE,
  SWITCHARTICLEFETCH,
  SWITCHRSS,
  SWITCHARTICLE,
  SETMEMBER,
  GETRSSRESPONSE,
  INITUSERRSSLIST,
  GROUPINIT,
  RESETARTICLEFETCH,
  SWITCHGROUPSELECT,
  INITGROUPSELECT,
  INITARTICLEFOLDERS,
};
