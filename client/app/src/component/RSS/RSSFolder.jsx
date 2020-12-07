import { useEffect, useState } from "react";

import TreeItem from "@material-ui/lab/TreeItem";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { app } from "../../lib/lib.js";
import { useDispatch } from "react-redux";
import styles from "../SideTab/FolderTab.module.css";
import { SWITCHARTICLE } from "../../redux/actions";
import { SWITCHRSS } from "../../redux/actions";
export default function RSSFolder(props) {
  const [RSS, setRSS] = useState([]);
  const dispatch = useDispatch();
  let user = props.user;
  //   useEffect(() => {
  //     function getMemberFolderTags() {
  //       if (user) {
  //         app.getMemberFolderTags(props.folderId).then((folderTags) => {
  //           setRSS(folderTags);
  //         });
  //       }
  //     }
  //     getMemberFolderTags();
  //   }, [user]);

  function showRSSItem(RSS) {
    let RSSList = [];
    if (RSS.length > 0) {
      for (let i in RSS) {
        RSSList.push(
          <TreeItem
            key={RSS[i].id}
            nodeId={RSS[i].id}
            label={
              <div className={styles.labelWrapper}>
                <BookmarkIcon style={{ fontSize: 20 }} />
                <div className={styles.labelTitle}>{RSS[i].title}</div>
              </div>
            }
            onClick={() => {
              console.log(RSS[i].id);
              dispatch(SWITCHRSS(RSS[i].id));
              //   dispatch(SWITCHARTICLE(tabs[i].id));
            }}
          />
        );
      }
    }
    return RSSList;
  }
  const RSSList = showRSSItem(props.folderRSS);
  return <div>{RSSList}</div>;
}
