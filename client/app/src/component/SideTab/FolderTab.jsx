import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./FolderTab.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector } from "react-redux";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { Link } from "react-router-dom";
import MarkunreadIcon from "@material-ui/icons/Markunread";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import BookmarkIcon from "@material-ui/icons/Bookmark";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { app } from "../../lib/lib.js";
import AddArticle from "../AddArticle";
import { useDispatch } from "react-redux";
import { SWITCHARTICLE, INITARTICLEFOLDERS } from "../../redux/actions";
import { db } from "../../firebase.js";
import firebase from "firebase/app";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DescriptionIcon from "@material-ui/icons/Description";
import Folder from "./Folder";

const useStyles = makeStyles({
  root: {
    color: "#B5B5B5",
    textAlign: "left",
    padding: "0px",
    flexGrow: 1,
    maxWidth: 200,
    marginBottom: "15px",
  },
});

export default function FolderTab() {
  const itemstyle = makeStyles({
    root: {
      paddingLeft: "25px",

      maxWidth: 200,
      marginBottom: "5px",
    },
  });
  const classes = useStyles();
  const itemStyle = itemstyle();
  const dispatch = useDispatch();
  const [addArticle, setAddArticle] = useState(false);
  const [tabChange, setTabChange] = useState("");
  const [editFolder, setEditFolder] = useState(false);
  const [addFolderInput, setAddFolderInput] = useState("");

  const articleFolders = useSelector((state) => {
    console.log(state);
    return state.articleReducer.articleFolders;
  });

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
      dispatch(INITARTICLEFOLDERS(newArticleFolders));

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
      dispatch(INITARTICLEFOLDERS(newArticleFolders));
    }
  }

  useEffect(() => {
    console.log(tabChange);
    function getArticleFolders() {
      if (user) {
        app
          .getMemberArticleFolders(user.uid)
          .then((articleFolders) => {
            console.log(articleFolders);
            dispatch(INITARTICLEFOLDERS(articleFolders));

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
            dispatch(INITARTICLEFOLDERS(newFolder));
          });
      }
    }
    getArticleFolders();
  }, [user, tabChange]);

  function showArticleFolders(folders) {
    let articleFolderList = [];
    if (folders.length > 0) {
      for (let i in folders) {
        articleFolderList.push(
          <Droppable droppableId={folders[i].id}>
            {(provided) => (
              <TreeItem
                className={itemStyle.root}
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
      })
      .then(() => {
        setTabChange(tabChange + 1);
      });
  }
  const articleFolderList = showArticleFolders(articleFolders);
  // const allTabList = showTabTreeList(tabs);

  return (
    <div className={styles.folderTabWrapper}>
      <div className={styles.folderTab}>
        <Link to={"/board"}>
          <div className={styles.sectionTitle}>My Board</div>
          <TreeView
            className={classes.root}
            defaultExpanded={[""]}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <div
              className={styles.importWrapper}
              onClick={() => {
                setAddArticle(true);
              }}
            >
              <AddCircleIcon style={{ fontSize: 20, color: "white" }} />
              <div className={styles.importTitle}>Import Article</div>
            </div>
            <TreeItem
              nodeId="tagAll"
              label={
                <div className={styles.labelWrapper}>
                  <DescriptionIcon style={{ fontSize: 20, color: "#5B5B5B" }} />
                  <div className={styles.labelTitle}>All Articles</div>
                </div>
              }
              onClick={() => {
                console.log("all");
                dispatch(SWITCHARTICLE("all"));
              }}
            ></TreeItem>
            <div>Tags</div>
            <DragDropContext onDragEnd={onDragEnd}>
              {articleFolderList}
            </DragDropContext>
          </TreeView>
          {addArticle
            ? createPortal(
                <div className={styles.popup}>
                  <div
                    className={styles.blur}
                    onClick={() => {
                      setAddArticle(false);
                    }}
                  ></div>
                  <AddArticle
                    user={user}
                    close={() => {
                      setAddArticle(false);
                    }}
                  />
                </div>,
                document.body
              )
            : ""}
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
          <div
            className={styles.subTitle}
            onClick={() => {
              setEditFolder(true);
            }}
          >
            Add Folder
          </div>
        </Link>
      </div>
    </div>
  );
}
