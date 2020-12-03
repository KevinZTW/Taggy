import article_Reducer from "./article_Reducer.jsx";
import member_Reducer from "./member_Reducer.jsx";
import RSS_Reducer from "./RSS_Reducer";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  articleReducer: article_Reducer,
  memberReducer: member_Reducer,
  RSSReducer: RSS_Reducer,
});

export default allReducers;
