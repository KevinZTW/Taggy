import { useEffect, useState } from "react";

import TreeItem from "@material-ui/lab/TreeItem";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { app } from "../../lib/lib.js";
import { useDispatch } from "react-redux";
import styles from "../SideTab/FolderTab.module.css";
import { Draggable } from "react-beautiful-dnd";
import { SWITCHRSS } from "../../redux/actions";
import { Link } from "react-router-dom";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
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
    console.log("sho rss item run");
    console.log(RSS);
    let RSSList = [];
    if (RSS.length > 0) {
      let count = 0;
      for (let i in RSS) {
        console.log(RSS[i].title);
        RSSList.push(
          <Draggable draggableId={RSS[i].id} index={count} key={RSS[i].id}>
            {(provided) => (
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
              >
                <Link to={"/home/myfeeds"}>
                  <TreeItem
                    className={styles.treeItem}
                    key={RSS[i].id}
                    nodeId={RSS[i].id}
                    label={
                      <div className={styles.labelWrapper}>
                        <LocalOfferOutlinedIcon
                          style={{
                            fontSize: 20,
                            color: "rgba(225,225,225,0.3)",
                          }}
                        />
                        <div className={styles.labelTitle}>{RSS[i].title}</div>
                      </div>
                    }
                    onClick={() => {
                      console.log(RSS[i].id);
                      dispatch(SWITCHRSS(RSS[i].id));
                      //   dispatch(SWITCHARTICLE(tabs[i].id));
                    }}
                  />
                </Link>
              </div>
            )}
          </Draggable>
        );
        count++;
      }
    }
    return RSSList;
  }
  const RSSList = showRSSItem(props.folderRSS);
  console.log("rssfolder rerender");
  return <div>{RSSList}</div>;
}
