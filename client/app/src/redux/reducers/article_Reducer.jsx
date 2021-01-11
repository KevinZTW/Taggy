const article_Reducer = (
  state = {
    tagSelected: "all",
    fetchRequired: true,
    articleList: [],
    articleFolders: [],
    lastQuery: null,
  },
  action
) => {
  switch (action.type) {
    case "INITARTICLEFOLDERS":
      return {
        ...state,
        articleFolders: action.articleFolders,
      };
    case "ADDFETCHARTICLE":
      return {
        ...state,
        articleList: action.articleList,
        lastQuery: action.lastQuery,
        fetchRequired: false,
      };
    case "SWITCHARTICLEFETCH":
      return {
        ...state,
        fetchRequired: action.fetchRequired,
      };
    case "RESETARTICLEFETCH":
      return {
        ...state,

        articleList: [],
        lastQuery: null,
        fetchRequired: true,
      };
    case "SWITCHARTICLE":
      return {
        ...state,

        tagSelected: action.tagSelected,
      };

    default:
      return state;
  }
};

export default article_Reducer;
