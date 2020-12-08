//reducer
import { nanoid } from "nanoid";

const RSS_Reducer = (state = { feed: {}, ChannelRSSId: "all" }, action) => {
  switch (action.type) {
    case "GETRSSRESPONSE":
      return {
        ...state,
        feed: action.feed,
        url: action.url,
      };

    case "SWITCHRSS":
      return {
        ...state,
        ChannelRSSId: action.ChannelRSSId,
      };
    case "INITUSERRSSLIST":
      return {
        ...state,
        UserRSSList: action.RSSList,
      };
    case "SETUSERALLFEEDS":
      return {
        ...state,
        userAllFeeds: [...state.userAllFeeds, action.userAllFeeds],
      };
    default:
      return state;
  }
};

export default RSS_Reducer;
