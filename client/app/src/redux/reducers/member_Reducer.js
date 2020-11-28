//reducer
import { nanoid } from "nanoid";
const List = [
  { id: "list-0", title: "React", cardIds: ["card-0", "card-1", "card-2"] },
  { id: "list-1", title: "Redux", cardIds: ["card-3"] },
];

const member_Reducer = (state = List, action) => {
  switch (action.type) {
    // case "DeleteTask":
    //   let remaintasks = state.tasks.filter((task) => task.id != action.id);

    //   return { tasks: remaintasks };
    case "ADDMEMBER":
      console.log(state);

      return [
        ...state,
        {
          id: "list-" + nanoid(),
          title: action.title,
          cardIds: [],
        },
      ];

    default:
      return state;
  }
};

export default member_Reducer;
