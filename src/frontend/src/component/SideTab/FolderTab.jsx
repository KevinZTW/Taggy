import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import { createPortal } from "react-dom";
import styles from "./FolderTab.module.css";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector } from "react-redux";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { app } from "../../lib/lib.js";
import AddArticle from "../AddArticle";
import { useDispatch } from "react-redux";
import { SWITCHARTICLE, INITARTICLEFOLDERS } from "../../redux/actions";
import { db } from "../../firebase.js";
import firebase from "firebase/app";
import Tooltip from "@material-ui/core/Tooltip";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Folder from "./Folder";
import addTagFolderImg from "../../imgs/add_new_folder.png";
const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    color: "white",
    fontFamily: "Open Sans",
    fontSize: 14,
  },
}))(Tooltip);
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
const itemstyle = makeStyles({
  root: {
    paddingLeft: "25px",
    color: "#B5B5B5",
    maxWidth: 200,
    marginBottom: "5px",
  },
});
export default function FolderTab() {
  const classes = useStyles();
  const itemStyle = itemstyle();
  const dispatch = useDispatch();
  const [addArticle, setAddArticle] = useState(false);
  const [tabChange, setTabChange] = useState("");
  const [editFolder, setEditFolder] = useState(false);
  const [addFolderInput, setAddFolderInput] = useState("");

  const articleFolders = useSelector((state) => {
    return state.articleReducer.articleFolders;
  });

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  function onDragEnd(result) {
    const { destination, source } = result;

    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      const newArticleFolders = [...articleFolders];
      newArticleFolders.forEach((folder) => {
        if (folder.id === destination.droppableId) {
          const newTags = [...folder.tags];
          const moveItem = { ...newTags[source.index] };
          newTags.splice(source.index, 1);
          newTags.splice(destination.index, 0, moveItem);
          folder.tags = newTags;
          const firestoreTagArr = [];
          newTags.forEach((tag) => {
            firestoreTagArr.push(tag.id);
          });
          db.collection("articleFolders").doc(destination.droppableId).update({
            tags: firestoreTagArr,
          });
        }
      });
      dispatch(INITARTICLEFOLDERS(newArticleFolders));
    }
    if (destination.droppableId !== source.droppableId) {
      const newArticleFolders = [...articleFolders];
      let moveItem;
      newArticleFolders.forEach((folder) => {
        if (folder.id === source.droppableId) {
          const newTags = [...folder.tags];
          moveItem = { ...newTags[source.index] };
          newTags.splice(source.index, 1);
          folder.tags = newTags;
          const firestoreTagArr = [];
          newTags.forEach((tag) => {
            firestoreTagArr.push(tag.id);
          });
          db.collection("articleFolders").doc(source.droppableId).update({
            tags: firestoreTagArr,
          });
        }
      });
      newArticleFolders.forEach((folder) => {
        if (folder.id === destination.droppableId) {
          const newTags = [...folder.tags];

          newTags.splice(destination.index, 0, moveItem);
          folder.tags = newTags;
          const firestoreTagArr = [];
          newTags.forEach((tag) => {
            firestoreTagArr.push(tag.id);
          });

          db.collection("articleFolders").doc(destination.droppableId).update({
            tags: firestoreTagArr,
          });
        }
      });
      dispatch(INITARTICLEFOLDERS(newArticleFolders));
    }
  }

  useEffect(() => {
    function getArticleFolders() {
      if (user) {
        app.article
          .getMemberTagFoldersDetail(user.uid)
          .then((articleFolders) => {
            dispatch(INITARTICLEFOLDERS(articleFolders));

            return articleFolders;
          })
          .then(async (articleFolders) => {
            const tempFolderList = [];
            for (let i = 0; i < articleFolders.length; i++) {
              const tags = await app.getMemberFolderTags(articleFolders[i].id);

              tempFolderList.push({ ...articleFolders[i], tags: tags });
            }

            return tempFolderList;
          })
          .then((newFolder) => {
            dispatch(INITARTICLEFOLDERS(newFolder));
          });
      }
    }
    getArticleFolders();
  }, [user, tabChange]);

  function showArticleFolders(folders) {
    const articleFolderList = [];
    if (folders.length > 0) {
      for (const i in folders) {
        articleFolderList.push(
          <Droppable droppableId={folders[i].id} key={folders[i].id}>
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
                      style={{ fontSize: 20, color: "rgba(255,255,255,0.3)" }}
                    />
                    <div className={styles.labelTitle}>{folders[i].name}</div>
                  </div>
                }
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

  return (
    <div className={styles.folderTabWrapper}>
      <div className={styles.folderTab}>
        <div className={styles.sectionTitle}>My Board</div>

        <div
          className={styles.addArticleWrapper}
          onClick={() => {
            setAddArticle(true);
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlinedIcon />}
          >
            Import Article
          </Button>
        </div>
        <TreeView
          className={classes.root}
          defaultExpanded={[""]}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <div
            className={styles.keyTitleWrapper}
            onClick={() => {
              dispatch(SWITCHARTICLE("all"));
            }}
          >
            <DescriptionOutlinedIcon
              style={{ fontSize: 20, color: "#2074ec" }}
            />
            <div className={styles.keyTitle}>All Articles</div>
          </div>

          <div className={styles.tagWrapper}>
            <div className={styles.tag}>Tags</div>
            <CustomTooltip title="add tags folder" arrow>
              <CreateNewFolderOutlinedIcon
                onClick={() => {
                  setEditFolder(true);
                }}
                className={styles.setting}
                fontSize="small"
                style={{ color: "#b2b2b2" }}
              />
            </CustomTooltip>
          </div>
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
                  <div className={styles.addTitle}>Add new folder</div>
                  <div className={styles.addSubTitle}>
                    Create folder to organize tags you created
                  </div>
                  <label htmlFor="addForm" className={styles.addFolderLabel}>
                    Enter new folder name
                  </label>
                  <div className={styles.addFormWrapper}>
                    <form id="addForm" action="">
                      <input
                        className={styles.addInput}
                        type="text"
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
                  <div className={styles.tagsImgWrapper}>
                    <img src={addTagFolderImg} alt="" />
                  </div>
                </div>
              </div>,
              document.body
            )
          : ""}
      </div>
    </div>
  );
}
