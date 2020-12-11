import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./FolderTab.module.css";
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
import Folder from "./Folder";

const useStyles = makeStyles({
  root: {
    color: "#B5B5B5",

    flexGrow: 1,
    maxWidth: 400,
    marginBottom: "10px",
  },
});

export default function GroupFolderTab() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editFolder, setEditFolder] = useState(false);
  const [addFolderInput, setAddFolderInput] = useState("");
  const [articleFolders, setArticleFolders] = useState([]);
  console.log(articleFolders);

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    console.log(result);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log("nothing should happended");
      return;
    }
    if (destination.droppableId === source.droppableId) {
      console.log("move inside same folder");
      let newArticleFolders = [...articleFolders];
      newArticleFolders.forEach((folder) => {
        if (folder.id === destination.droppableId) {
          console.log("hihi");
          let newTags = [...folder.tags];
          let moveItem = { ...newTags[source.index] };
          console.log(moveItem);
          newTags.splice(source.index, 1);
          newTags.splice(destination.index, 0, moveItem);
          console.log(newTags);
          folder.tags = newTags;
          let firestoreTagArr = [];
          newTags.forEach((tag) => {
            firestoreTagArr.push(tag.id);
          });
          console.log(firestoreTagArr);
          db.collection("articleFolders").doc(destination.droppableId).update({
            tags: firestoreTagArr,
          });
        }
      });
      setArticleFolders(newArticleFolders);
      console.log(destination.index, source.index);
      console.log(source.droppableId);
      console.log(destination.droppableId);
    }
    if (destination.droppableId !== source.droppableId) {
      console.log("move to another folder");
      let newArticleFolders = [...articleFolders];
      let moveItem;
      newArticleFolders.forEach((folder) => {
        if (folder.id === source.droppableId) {
          let newTags = [...folder.tags];
          moveItem = { ...newTags[source.index] };
          newTags.splice(source.index, 1);
          folder.tags = newTags;
          let firestoreTagArr = [];
          newTags.forEach((tag) => {
            firestoreTagArr.push(tag.id);
          });
          console.log(firestoreTagArr);
          db.collection("articleFolders").doc(source.droppableId).update({
            tags: firestoreTagArr,
          });
        }
      });
      newArticleFolders.forEach((folder) => {
        if (folder.id === destination.droppableId) {
          let newTags = [...folder.tags];

          newTags.splice(destination.index, 0, moveItem);
          folder.tags = newTags;
          let firestoreTagArr = [];
          newTags.forEach((tag) => {
            firestoreTagArr.push(tag.id);
          });
          console.log(firestoreTagArr);
          db.collection("articleFolders").doc(destination.droppableId).update({
            tags: firestoreTagArr,
          });
        }
      });
      setArticleFolders(newArticleFolders);
    }
  }

  useEffect(() => {
    function getArticleFolders() {
      if (user) {
        app
          .getMemberArticleFolders(user.uid)
          .then((articleFolders) => {
            console.log(articleFolders);
            setArticleFolders(articleFolders);
            return articleFolders;
          })
          .then(async (articleFolders) => {
            let tempFolderList = [];
            for (let i = 0; i < articleFolders.length; i++) {
              let tags = await app.getMemberFolderTags(articleFolders[i].id);
              console.log(tags);
              tempFolderList.push({ ...articleFolders[i], tags: tags });
            }
            console.log(tempFolderList);
            return tempFolderList;
          })
          .then((newFolder) => {
            console.log(newFolder);
            setArticleFolders(newFolder);
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
  function addArticleFolder(name, uid) {
    db.collection("articleFolders")
      .add({
        name: name,
        uid: uid,
      })
      .then((docRef) => {
        docRef.update({ id: docRef.id });
        return docRef.id;
      })
      .then((id) => {
        db.collection("Member")
          .doc(uid)
          .update({
            articleFolders: firebase.firestore.FieldValue.arrayUnion(id),
          });
      });
  }
  const articleFolderList = showArticleFolders(articleFolders);
  // const allTabList = showTabTreeList(tabs);

  return (
    <div className={styles.folderTabWrapper}>
      <div className={styles.folderTab}>
        <div className={styles.sectionTitle}>Group Boards</div>
        <div className={styles.subTitle}>Create New Group</div>
        <TreeView
          className={classes.root}
          defaultExpanded={[""]}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {" "}
          <TreeItem
            nodeId="Appworks"
            label={
              <div className={styles.labelWrapper}>
                <PeopleAltIcon />
                <div className={styles.labelTitle}>Appworks Front End</div>
              </div>
            }
            onClick={() => {
              console.log("all");
              dispatch(SWITCHARTICLE("all"));
            }}
          >
            <TreeItem
              nodeId="tagAll"
              label={
                <div className={styles.labelWrapper}>
                  <div className={styles.labelTitle}>Al1l</div>
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
            {/* <DragDropContext onDragEnd={onDragEnd}>
              {articleFolderList}
             </DragDropContext> */}
            <div
              className={styles.subTitle}
              onClick={() => {
                setEditFolder(true);
              }}
            >
              Add Folder
            </div>
          </TreeItem>
        </TreeView>
        <TreeView
          className={classes.root}
          defaultExpanded={[""]}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {" "}
          <TreeItem
            nodeId="Appworks2"
            label={
              <div className={styles.labelWrapper}>
                <PeopleAltIcon />
                <div className={styles.labelTitle}>上進群組666</div>
              </div>
            }
            onClick={() => {
              console.log("all");
              dispatch(SWITCHARTICLE("all"));
            }}
          >
            <TreeItem
              nodeId="tagAll2"
              label={
                <div className={styles.labelWrapper}>
                  <div className={styles.labelTitle}>Al1l</div>
                </div>
              }
              onClick={() => {
                console.log("all");
                dispatch(SWITCHARTICLE("all"));
              }}
            ></TreeItem>
            <TreeItem
              nodeId="unTag2"
              label={
                <div className={styles.labelWrapper}>
                  <MarkunreadIcon style={{ fontSize: 20, color: "#5B5B5B" }} />
                  <div className={styles.labelTitle}>Untaged</div>
                </div>
              }
            />
            <DragDropContext onDragEnd={onDragEnd}>
              {articleFolderList}
            </DragDropContext>
            <div
              className={styles.subTitle}
              onClick={() => {
                setEditFolder(true);
              }}
            >
              Add Folder
            </div>
          </TreeItem>
        </TreeView>
        {editFolder
          ? createPortal(
              <div className={styles.popup}>
                <div
                  className={styles.blur}
                  onClick={() => {
                    setEditFolder(false);
                  }}
                ></div>
                <div className={styles.addFolder}>
                  <div className={styles.addTitle}>Add New Folder</div>
                  <form id="addForm" action="">
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Folder Name"
                      value={addFolderInput}
                      onChange={(e) => {
                        setAddFolderInput(e.target.value);
                      }}
                    />
                    <button
                      type="submit"
                      className={styles.saveBtn}
                      form="addForm"
                      onClick={() => {
                        if (user) {
                          addArticleFolder(addFolderInput, user.uid);
                          setEditFolder(false);
                        } else {
                          alert("Please login to add folder!");
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditFolder(false);
                      }}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>,
              document.body
            )
          : ""}
      </div>
    </div>
  );
}
