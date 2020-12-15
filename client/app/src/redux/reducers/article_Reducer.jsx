//reducer
import { nanoid } from "nanoid";

const article_Reducer = (
  state = {
    tagSelected: "all",
    articleList: [],
    articleFolders: [],
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
    case "INITARTICLE":
      return {
        ...state,

        articleList: action.articleList,
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
