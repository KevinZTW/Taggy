//reducer
import { nanoid } from "nanoid";

const article_Reducer = (
  state = {
    tagSelected: "all",
    articleList: [],
  },
  action
) => {
  switch (action.type) {
    // case "DeleteTask":
    //   let remaintasks = state.tasks.filter((task) => task.id != action.id);

    //   return { tasks: remaintasks };
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
    // case "CHANGETITLE ":
    //   console.log("hihi");
    //   let editedlist = state.map((list) => {
    //     if (list.id === action.listId) {
    //       return { ...list, title: action.newtitle };
    //     }
    //     return list;
    //   });
    //   console.log(editedlist);
    //   return editedlist;

    default:
      return state;
  }
};

export default article_Reducer;
