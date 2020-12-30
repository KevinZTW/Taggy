import styles from "../SideTab/FolderTab.module.css";

import { useSelector } from "react-redux";

import TreeItem from "@material-ui/lab/TreeItem";

import FolderOpenIcon from "@material-ui/icons/FolderOpen";

import { Droppable } from "react-beautiful-dnd";
import Folder from "../SideTab/Folder";

export default function GroupFolderSub(props) {
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  function showArticleFolders(folders) {
    //console.log(folders);
    const articleFolderList = [];
    if (folders.length > 0) {
      for (const i in folders) {
        //console.log(folders[i].tags);
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
                  //console.log(folders[i].id);
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
  const folderList = showArticleFolders(props.folders);
  return folderList;
}
