//reducer
import { nanoid } from "nanoid";

const article_Reducer = (
  state = {
    tagSelected: "all",
    fetchRequired: true,
    articleList: [],
    articleFolders: [],
    lastQuery: null,
    // isLoaded: false
  },
  action
) => {
  switch (action.type) {
    // case "DeleteTask":
    //   let remaintasks = state.tasks.filter((task) => task.id != action.id);

    //   return { tasks: remaintasks };
    case "INITARTICLEFOLDERS":
      return {
        ...state,
        articleFolders: action.articleFolders,
        // isLoaded: true
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
