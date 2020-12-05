import { useEffect, useState } from "react";

import TreeItem from "@material-ui/lab/TreeItem";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { app } from "../../lib.js";
import { useDispatch } from "react-redux";
import styles from "./FolderTab.module.css";
import { SWITCHARTICLE } from "../../redux/actions";
export default function Folder(props) {
  const [tabs, setTabs] = useState([]);
  const dispatch = useDispatch();
  let user = props.user;
  useEffect(() => {
    function getMemberFolderTags() {
      if (user) {
        app.getMemberFolderTags(props.folderId).then((folderTags) => {
          setTabs(folderTags);
        });
      }
    }
    getMemberFolderTags();
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
                <BookmarkIcon style={{ fontSize: 20, color: "#5B5B5B" }} />
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
  return <div>{tabList}</div>;
}
