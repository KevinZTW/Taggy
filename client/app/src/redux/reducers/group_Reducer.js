const group_Reducer = (
  state = {
    groupId: null,
    tagSelected: "all",
    articleList: [],
  },
  action
) => {
  switch (action.type) {
    case "GROUPINIT":
      return { ...state, groups: action.groups };

    case "INITGROUPSELECT":
      return {
        ...state,
        groupId: action.groupId,
        groupName: action.groupName,
      };
    case "SWITCHGROUPSELECT":
      return {
        ...state,
        groupId: action.groupId,
        groupName: action.groupName,
      };
    // case "INITGROUPARTICLE":
    //   return {
    //     ...state,

    //     articleList: action.articleList,
    //   };
    // case "SWITCHGROUPARTICLE":
    //   return {
    //     ...state,
    //     tagSelected: action.tagSelected,
    //   };

    default:
      return state;
  }
};

export default group_Reducer;
