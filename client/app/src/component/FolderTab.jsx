import { useEffect, useState } from "react";
import styles from "../css/FolderTab.module.css";
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
import { app } from "../lib.js";
import { useDispatch } from "react-redux";
import { SWITCHARTICLE } from "../redux/actions";
const useStyles = makeStyles({
  root: {
    color: "white",

    flexGrow: 1,
    maxWidth: 400,
    marginBottom: "10px",
  },
});
export default function FolderTab() {
  const fakeTagsSelection = {
    JIWD: {
      name: "前端",
      tags: ["HTML", "CSS", "JS"],
    },
  };
  const dispatch = useDispatch();
  const [tabs, setTabs] = useState([]);
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  useEffect(() => {
    function getMemberTags() {
      if (user) {
        app.getMemberTags(user.uid).then((tabsSelection) => {
          setTabs(tabsSelection);
        });
      }
    }
    getMemberTags();
  }, [user]);

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
                <BookmarkIcon style={{ fontSize: 20 }} />
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

  const tabList = showTabTreeList(tabs);
  const classes = useStyles();
  return (
    <div className={styles.folderTab}>
      <div className={styles.sectionTitle}>Saved</div>
      <TreeView
        className={classes.root}
        defaultExpanded={["tagAll"]}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem
          nodeId="tagAll"
          label={
            <div className={styles.labelWrapper}>
              <FolderOpenIcon style={{ fontSize: 20 }} />
              <div className={styles.labelTitle}>All</div>
            </div>
          }
          onClick={() => {
            console.log("all");
            dispatch(SWITCHARTICLE("all"));
          }}
        >
          <TreeItem
            nodeId="unSorted"
            label={
              <div className={styles.labelWrapper}>
                <MarkunreadIcon style={{ fontSize: 20 }} />
                <div className={styles.labelTitle}>Unsorted</div>
              </div>
            }
          />
          {tabList}
        </TreeItem>
      </TreeView>

      <div className={styles.sectionTitle}>RSS</div>
      <Link to={"/findrss"}>
        <div>FindRSS</div>
      </Link>
    </div>
  );
}
