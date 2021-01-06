import styles from "./MobileFunctionTab.module.css";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import { SWITCHRSS } from "../../redux/actions";
import { Link } from "react-router-dom";
import TrendingUpOutlinedIcon from "@material-ui/icons/TrendingUpOutlined";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import { useDispatch } from "react-redux";
import RssFeedIcon from "@material-ui/icons/RssFeed";
export default function FunctionTab(props) {
  const dispatch = useDispatch();
  return (
    <div className={styles.mobileFunctionTabWrapper}>
      <div className={styles.mobileFunctionTab}>
        <div className={styles.mobileIconWrapper}>
          <Link to={"/home"}>
            <TrendingUpOutlinedIcon
              fontSize="medium"
              style={
                props.focus === "home"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
            <div className={styles.title}>Today</div>
          </Link>
          <Link to={"/home/channels"}>
            <ExploreOutlinedIcon
              fontSize="medium"
              style={
                props.focus === "channels"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
            <div className={styles.title}>Explore</div>
          </Link>
          <Link to={"/home/myfeeds"}>
            <RssFeedIcon
              fontSize="medium"
              onClick={() => {
                dispatch(SWITCHRSS("all"));
              }}
              style={
                props.focus === "myfeeds"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
            <div className={styles.title}>My Feeds</div>
          </Link>
          <Link to={"/board"}>
            <BookmarkBorderIcon
              fontSize="medium"
              style={
                props.focus === "board"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
            <div className={styles.title}>Board</div>
          </Link>

          {/* <Link to={"/group"}>
            <PeopleAltIcon
              fontSize="medium"
              style={
                props.focus === "group"
                  ? { color: "#FFFFFF" }
                  : { color: "#747474" }
              }
            />
            <div className={styles.title}>Group</div>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
