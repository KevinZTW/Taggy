import { useEffect, useState } from "react";
import styles from "../SideTab/FolderTab.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector } from "react-redux";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { Link } from "react-router-dom";
import MarkunreadIcon from "@material-ui/icons/Markunread";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { SWITCHRSS } from "../../redux/actions";
import { app } from "../../lib/lib.js";
import { useDispatch } from "react-redux";
import { db } from "../../firebase.js";
import { INITUSERRSSLIST } from "../../redux/actions";
import RSSFolder from "./RSSFolder";
const useStyles = makeStyles({
  root: {
    color: "#B5B5B5",
    flexGrow: 10,
    maxWidth: 220,
    marginBottom: "10px",
  },
});

export default function RSSTab() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [RSSFolders, setRSSFolders] = useState([]);

  function getUserRSSList(uid) {
    db.collection("Member")
      .doc(uid)
      .get()
      .then((doc) => {
        dispatch(INITUSERRSSLIST(doc.data().subscribedRSS));
      });
  }

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  const userRSSList = useSelector((state) => {
    return state.RSSReducer.UserRSSList;
  });
  useEffect(() => {}, [userRSSList]);
  useEffect(() => {
    function getRSSFolders() {
      if (user) {
        app
          .getMemberRSSFolders(user.uid)
          .then((RSSFolders) => {
            setRSSFolders(RSSFolders);
            return RSSFolders;
          })
          .then((RSSFolders) => {
            RSSFolders.forEach(async (folder) => {
              if (folder.RSSIds) {
                await folder.RSSIds.forEach(async (RSSId) => {
                  let RSS = await app.getRSSInfo(RSSId);
                  folder.RSS.push(RSS);
                });
              }

              return folder;
            });

            setRSSFolders(RSSFolders);
          });
      }
    }
    if (user) {
      getUserRSSList(user.uid);
    }
    getRSSFolders();
  }, [user]);

  function showRSSFolders(folders) {
    let RSSFolderList = [];
    if (folders.length > 0) {
      for (let i in folders) {
        RSSFolderList.push(
          <TreeItem
            key={folders[i].id}
            nodeId={folders[i].id}
            label={
              <div className={styles.labelWrapper}>
                <FolderOpenIcon style={{ fontSize: 20 }} />
                <div className={styles.labelTitle}>{folders[i].name}</div>
              </div>
            }
            onClick={() => {}}
          >
            <RSSFolder
              user={user}
              folderId={folders[i].id}
              folderRSS={folders[i].RSS}
            />
          </TreeItem>
        );
      }
    }
    return RSSFolderList;
  }

  const articleFolderList = showRSSFolders(RSSFolders);

  return (
    <div className={styles.folderTabWrapper}>
      <div className={styles.folderTab}>
        <Link to={"/rss"}>
          <div className={styles.sectionTitle}>RSS</div>
          <TreeView
            className={classes.root}
            defaultExpanded={[""]}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <TreeItem
              nodeId="tagAll"
              label={
                <div className={styles.labelWrapper}>
                  <div className={styles.labelTitle}>All Feeds</div>
                </div>
              }
              onClick={() => {
                dispatch(SWITCHRSS("all"));
              }}
            ></TreeItem>

            {articleFolderList}
          </TreeView>
        </Link>
        <Link to={"/rssexplore"}>
          <div className={styles.subTitle}>AddRSS</div>
        </Link>
      </div>
    </div>
  );
}
