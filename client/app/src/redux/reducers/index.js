import article_Reducer from "./article_Reducer.jsx";
import member_Reducer from "./member_Reducer.jsx";

import { combineReducers } from "redux";

const allReducers = combineReducers({
  articleReducer: article_Reducer,
  memberReducer: member_Reducer,
});

export default allReducers;
