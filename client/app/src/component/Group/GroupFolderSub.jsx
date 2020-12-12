import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../SideTab/FolderTab.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector } from "react-redux";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import TreeItem from "@material-ui/lab/TreeItem";
import { Link } from "react-router-dom";
import MarkunreadIcon from "@material-ui/icons/Markunread";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { app } from "../../lib/lib.js";
import { useDispatch } from "react-redux";
import { SWITCHARTICLE } from "../../redux/actions";
import { db } from "../../firebase.js";
import firebase from "firebase/app";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Folder from "../SideTab/Folder";

export default function GroupFolderSub(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  function showArticleFolders(folders) {
    console.log(folders);
    let articleFolderList = [];
    if (folders.length > 0) {
      for (let i in folders) {
        console.log(folders[i].tags);
        articleFolderList.push(
          <Droppable droppableId={folders[i].id}>
            {(provided) => (
              <TreeItem
                ref={provided.innerRef}
                {...provided.droppableProps}
                key={folders[i].id}
                nodeId={folders[i].id}
                label={
                  <div className={styles.labelWrapper}>
                    <FolderOpenIcon
                      style={{ fontSize: 20, color: "#5B5B5B" }}
                    />
                    <div className={styles.labelTitle}>{folders[i].name}</div>
                  </div>
                }
                onClick={() => {
                  console.log(folders[i].id);
                  // dispatch(SWITCHARTICLE(folders[i].id));
                }}
              >
                <Folder
                  user={user}
                  folderTags={folders[i].tags}
                  key={folders[i].id}
                />
                {provided.placeholder}
              </TreeItem>
            )}
          </Droppable>
        );
      }
    }
    return articleFolderList;
  }
  let folderList = showArticleFolders(props.folders);
  return folderList;
}
