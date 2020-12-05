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
import { app } from "../../lib.js";
import { useDispatch } from "react-redux";

import RSSFolder from "./RSSFolder";
const useStyles = makeStyles({
  root: {
    color: "white",

    flexGrow: 1,
    maxWidth: 400,
    marginBottom: "10px",
  },
});

export default function RSSTab() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [RSSFolders, setRSSFolders] = useState([]);
  const RSSfoldersfake = [
    {
      id: "folderid",
      name: "foldername",
      RSSId: ["werwe", "rwfs33d"],
      RSSName: ["前端", "c.4"],
    },
  ];
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
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
                  console.log(folder);
                  console.log(RSSId);
                  let RSS = await app.getRSSInfo(RSSId);
                  console.log(RSS);
                  folder.RSS.push(RSS);
                });
                console.log(folder);
              }

              return folder;
            });

            setRSSFolders(RSSFolders);
          });
      }
    }
    getRSSFolders();
  }, [user]);

  function showRSSFolders(folders) {
    console.log(folders);
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
            onClick={() => {
              console.log(folders[i].id);
            }}
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

  function getRSSFeeds() {}

  const articleFolderList = showRSSFolders(RSSFolders);

  return (
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
                <div className={styles.labelTitle}>All</div>
              </div>
            }
            onClick={() => {
              console.log("all");
              // dispatch(SWITCHARTICLE("all"));
            }}
          ></TreeItem>

          {articleFolderList}
        </TreeView>
      </Link>
      <Link to={"/rssexplore"}>
        <div>AddRSS</div>
      </Link>
    </div>
  );
}
