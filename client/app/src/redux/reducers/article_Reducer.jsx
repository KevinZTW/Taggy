//reducer
import { nanoid } from "nanoid";
const Article = [
  { id: "list-0", title: "React", cardIds: ["card-0", "card-1", "card-2"] },
  { id: "list-1", title: "Redux", cardIds: ["card-3"] },
];

const article_Reducer = (state = [], action) => {
  switch (action.type) {
    // case "DeleteTask":
    //   let remaintasks = state.tasks.filter((task) => task.id != action.id);

    //   return { tasks: remaintasks };
    case "AddArticle":
      console.log(state);

      return [
        ...state,
        {
          id: "list-" + nanoid(),
          title: action.title,
          cardIds: [],
        },
      ];

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

    // case "DELETELIST":
    //   let remainlist = state.filter((list) => list.id !== action.id);

    //   return remainlist;

    // case "ADDCARD":
    //   let newlist = state.map((list) => {
    //     if (list.id === action.listId) {
    //       return { ...list, cardIds: [...list.cardIds, action.newcardId] };
    //     }
    //     return list;
    //   });
    //   console.log(newlist);
    //   return newlist;

    // case "SWITCHCARDINLIST": //listId, destination, source
    //   let newState = state.map((list) => {
    //     console.log(list.id, action.listId);
    //     if (list.id === action.listId) {
    //       let newcardIds = list.cardIds;
    //       [newcardIds[action.destination], newcardIds[action.source]] = [
    //         newcardIds[action.source],
    //         newcardIds[action.destination],
    //       ];
    //       return { ...list, cardIds: newcardIds };
    //     }
    //     return list;
    //   });
    //   return newState;
    // // case "ToggleTask":
    //   let updatetasks = state.tasks.map((task) => {
    //     console.log(action.id, task.id);
    //     if (action.id === task.id) {
    //       return { ...task, completed: !task.completed };
    //     }
    //     return task;
    //   });

    //   return { tasks: updatetasks };

    // case "EditTask":
    //   let editTasks = state.tasks.map((task) => {
    //     if (action.id === task.id) {
    //       return { ...task, name: action.name };
    //     }
    //     return task;
    //   });

    //   return { tasks: editTasks };

    default:
      return state;
  }
};

export default article_Reducer;
