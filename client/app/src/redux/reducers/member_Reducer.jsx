//reducer
import { nanoid } from "nanoid";

const member_Reducer = (state = {}, action) => {
  switch (action.type) {
    case "SETMEMBER":
      return {
        ...state,
        user: {
          uid: action.uid,
          displayName: action.displayName,
          email: action.email,
        },
      };

    case "GROUPINIT":
      return { ...state, groups: action.groups };
    default:
      return state;
  }
};

export default member_Reducer;
