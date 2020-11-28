import article_Reducer from "./article_Reducer";
import member_Reducer from "./member_Reducer";

import { combineReducers } from "redux";

const allReducers = combineReducers({
  articleReducer: article_Reducer,
  memberReducer: member_Reducer,
});

export default allReducers;
