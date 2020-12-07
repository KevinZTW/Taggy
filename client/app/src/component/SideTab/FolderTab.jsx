import { useEffect, useState } from "react";
import styles from "./FolderTab.module.css";
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
import { app } from "../../lib/lib.js";
import { useDispatch } from "react-redux";
import { SWITCHARTICLE } from "../../redux/actions";
import RSSTab from "../RSS/RSSTab";
import Folder from "./Folder";
const useStyles = makeStyles({
  root: {
    color: "#B5B5B5",

    flexGrow: 1,
    maxWidth: 400,
    marginBottom: "10px",
  },
});

export default function FolderTab() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabs, setTabs] = useState([]);
  const [articleFolders, setArticleFolders] = useState([]);
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  useEffect(() => {
    function getArticleFolders() {
      if (user) {
        app.getMemberArticleFolders(user.uid).then((articleFolders) => {
          setArticleFolders(articleFolders);
        });
      }
    }
    getArticleFolders();
  }, [user]);

  function showArticleFolders(folders) {
    console.log(folders);
    let articleFolderList = [];
    if (folders.length > 0) {
      for (let i in folders) {
        articleFolderList.push(
          <TreeItem
            key={folders[i].id}
            nodeId={folders[i].id}
            label={
              <div className={styles.labelWrapper}>
                <FolderOpenIcon style={{ fontSize: 20, color: "#5B5B5B" }} />
                <div className={styles.labelTitle}>{folders[i].name}</div>
              </div>
            }
            onClick={() => {
              console.log(folders[i].id);
              // dispatch(SWITCHARTICLE(folders[i].id));
            }}
          >
            <Folder user={user} folderId={folders[i].id} />
          </TreeItem>
        );
      }
    }
    return articleFolderList;
  }
  function showTabTreeList(tabs) {
    let tabList = [];
    if (tabs.length > 0) {
      for (let i in tabs) {
        tabList.push(
          <TreeItem
            key={tabs[i].id}
            nodeId={tabs[i].id}
            label={
              <div className={styles.labelWrapper}>
                <FolderOpenIcon style={{ fontSize: 20, color: "#5B5B5B" }} />
                <div className={styles.labelTitle}>{tabs[i].label}</div>
              </div>
            }
            onClick={() => {
              console.log(tabs[i].id);
              dispatch(SWITCHARTICLE(tabs[i].id));
            }}
          />
        );
      }
    }
    return tabList;
  }
  const articleFolderList = showArticleFolders(articleFolders);
  // const allTabList = showTabTreeList(tabs);

  return (
    <Link to={"/board"}>
      <div className={styles.folderTabWrapper}>
        <div className={styles.folderTab}>
          <div className={styles.sectionTitle}>Saved</div>
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
                  <div className={styles.labelTitle}>All</div>
                </div>
              }
              onClick={() => {
                console.log("all");
                dispatch(SWITCHARTICLE("all"));
              }}
            ></TreeItem>
            <TreeItem
              nodeId="unTag"
              label={
                <div className={styles.labelWrapper}>
                  <MarkunreadIcon style={{ fontSize: 20, color: "#5B5B5B" }} />
                  <div className={styles.labelTitle}>Untaged</div>
                </div>
              }
            />
            {articleFolderList}
          </TreeView>

          {/* <div className={styles.sectionTitle}>RSS</div>
      <Link to={"/findrss"}>
        <div>FindRSS</div>
      </Link> */}
        </div>
      </div>
    </Link>
  );
}
