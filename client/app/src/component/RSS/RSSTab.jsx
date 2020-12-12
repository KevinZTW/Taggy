import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
import { SWITCHRSS } from "../../redux/actions";
import { app } from "../../lib/lib.js";
import { useDispatch } from "react-redux";
import { db } from "../../firebase.js";
import firebase from "firebase/app";
import { INITUSERRSSLIST } from "../../redux/actions";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import RSSFolder from "./RSSFolder";
const useStyles = makeStyles({
  root: {
    color: "#B5B5B5",
    flexGrow: 10,
    maxWidth: 220,
    marginBottom: "10px",
  },
});

export default function RSSTab() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [addFolderInput, setAddFolderInput] = useState("");
  const [showPage, setShowPage] = useState(false);
  const [RSSFolders, setRSSFolders] = useState([]);

  function getUserRSSList(uid) {
    db.collection("Member")
      .doc(uid)
      .get()
      .then((doc) => {
        dispatch(INITUSERRSSLIST(doc.data().subscribedRSS));
      });
  }
  function addNewGroup(uid, name) {
    db.collection("GroupBoard")
      .add({
        name: name,
        member: [uid],
      })
      .then((docRef) => {
        docRef.update({ id: docRef.id });
        return docRef.id;
      })
      .then((id) => {
        db.collection("Member")
          .doc(uid)
          .update({
            board: firebase.firestore.FieldValue.arrayUnion(id),
          });
      });
  }
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });
  const userRSSList = useSelector((state) => {
    return state.RSSReducer.UserRSSList;
  });
  useEffect(() => {}, [userRSSList]);
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
                  let RSS = await app.getRSSInfo(RSSId);
                  folder.RSS.push(RSS);
                });
              }

              return folder;
            });

            setRSSFolders(RSSFolders);
          });
      }
    }
    if (user) {
      getUserRSSList(user.uid);
    }
    getRSSFolders();
  }, [user]);
  function addRSSFolder(name, uid) {
    db.collection("RSSFolders")
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
            RSSFolders: firebase.firestore.FieldValue.arrayUnion(id),
          });
      });
  }
  function showRSSFolders(folders) {
    let RSSFolderList = [];
    if (folders.length > 0) {
      for (let i in folders) {
        RSSFolderList.push(
          <Droppable droppableId={folders[i].id}>
            {(provided) => (
              <TreeItem
                ref={provided.innerRef}
                {...provided.droppableProps}
                key={folders[i].id}
                nodeId={folders[i].id}
                label={
                  <div className={styles.labelWrapper}>
                    <FolderOpenIcon style={{ fontSize: 20 }} />
                    <div className={styles.labelTitle}>{folders[i].name}</div>
                  </div>
                }
                onClick={() => {}}
              >
                <RSSFolder
                  user={user}
                  folderId={folders[i].id}
                  folderRSS={folders[i].RSS}
                />
                {provided.placeholder}
              </TreeItem>
            )}
          </Droppable>
        );
      }
    }
    return RSSFolderList;
  }
  console.log(RSSFolders);
  const articleFolderList = showRSSFolders(RSSFolders);
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
      let newRSSFolders = [...RSSFolders];
      let newRSSIds;
      newRSSFolders.forEach((folder) => {
        if (folder.id === destination.droppableId) {
          let moveId = folder.RSSIds[source.index];
          newRSSIds = [...folder.RSSIds];

          newRSSIds.splice(source.index, 1);
          newRSSIds.splice(destination.index, 0, moveId);
          console.log(newRSSIds);
          let moveItem = folder.RSS[source.index];
          folder.RSS.splice(source.index, 1);
          folder.RSS.splice(destination.index, 0, moveItem);
          folder.RSSIds = newRSSIds;
        }
      });
      console.log(newRSSFolders);

      db.collection("RSSFolders").doc(destination.droppableId).update({
        RSS: newRSSIds,
      });
      setRSSFolders(newRSSFolders);

      console.log(destination.index, source.index);
      console.log(source.droppableId);
      console.log(destination.droppableId);
    }
    if (destination.droppableId !== source.droppableId) {
      console.log("move to another folder");
      let newRSSFolders = [...RSSFolders];
      let moveId;
      let moveItem;
      let newSourceRSSIds;
      let newDestinationRSSIds;
      newRSSFolders.forEach((folder) => {
        if (folder.id === source.droppableId) {
          moveId = folder.RSSIds[source.index];
          moveItem = folder.RSS[source.index];
          newSourceRSSIds = [...folder.RSSIds];
          newSourceRSSIds.splice(source.index, 1);
          folder.RSS.splice(source.index, 1);
          folder.RSSIds = newSourceRSSIds;
          db.collection("RSSFolders").doc(source.droppableId).update({
            RSS: newSourceRSSIds,
          });
        }
      });
      newRSSFolders.forEach((folder) => {
        if (folder.id === destination.droppableId) {
          newDestinationRSSIds = [...folder.RSSIds];
          newDestinationRSSIds.splice(destination.index, 0, moveId);
          folder.RSS.splice(destination.index, 0, moveItem);
          folder.RSSIds = newDestinationRSSIds;
          db.collection("RSSFolders").doc(destination.droppableId).update({
            RSS: newDestinationRSSIds,
          });
        }
      });
      setRSSFolders(newRSSFolders);
    }
  }
  return (
    <div className={styles.folderTabWrapper}>
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
                  <div className={styles.labelTitle}>All Feeds</div>
                </div>
              }
              onClick={() => {
                dispatch(SWITCHRSS("all"));
              }}
            ></TreeItem>
            <DragDropContext onDragEnd={onDragEnd}>
              {articleFolderList}
            </DragDropContext>
          </TreeView>
        </Link>
        <Link to={"/rssexplore"}>
          <div className={styles.subTitle}>Follow New Source</div>
        </Link>
        <div
          className={styles.subTitle}
          onClick={() => {
            setShowPage(true);
          }}
        >
          Add New Folder
        </div>
        {showPage
          ? createPortal(
              <div className={styles.popup}>
                <div
                  className={styles.blur}
                  onClick={() => {
                    setShowPage(false);
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
                          addRSSFolder(addFolderInput, user.uid);
                          setShowPage(false);
                        } else {
                          alert("Please login to add folder!");
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowPage(false);
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
