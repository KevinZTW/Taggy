//reducer
import { nanoid } from "nanoid";

const RSS_Reducer = (state = { feed: {} }, action) => {
  switch (action.type) {
    case "GETRSSRESPONSE":
      return {
        ...state,
        feed: action.feed,
        url: action.url,
      };
    default:
      return state;
  }
};

export default RSS_Reducer;
