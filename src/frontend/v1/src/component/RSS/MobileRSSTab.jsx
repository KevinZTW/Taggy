import Tooltip from "@material-ui/core/Tooltip";
import SearchIcon from "@material-ui/icons/Search";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../SideTab/FolderTab.module.css";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector } from "react-redux";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { Link } from "react-router-dom";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import Button from "@material-ui/core/Button";
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { SWITCHRSS } from "../../redux/actions";
import { app } from "../../lib/lib.js";
import { useDispatch } from "react-redux";
import { db } from "../../firebase.js";
import firebase from "firebase/app";

import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import { INITUSERRSSLIST } from "../../redux/actions";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import RSSFolder from "./RSSFolder";
import RssFeedIcon from "@material-ui/icons/RssFeed";

import TrendingUpOutlinedIcon from "@material-ui/icons/TrendingUpOutlined";

import addRSSFolderImg from "../../imgs/add_RSS_folder.png";
const useStyles = makeStyles({
  root: {
    color: "#B5B5B5",
    flexGrow: 10,
    maxWidth: 220,
    marginBottom: "10px",
    paddingLeft: "25px",
    paddingRight: "24px",
  },
});

const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    color: "white",
    fontFamily: "Open Sans",
    fontSize: 14,
  },
}))(Tooltip);
export default function RSSTab(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [addFolderInput, setAddFolderInput] = useState("");
  const [showPage, setShowPage] = useState(false);
  const [RSSFolders, setRSSFolders] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const folderstyle = makeStyles({
    root: {
      paddingLeft: "23px",
      paddingBottom: "8px",
      maxWidth: 200,
      fontSize: "15px important",
      marginBottom: "3px",
    },
  });
  const folderStyle = folderstyle();
  function getUserRSSList(uid) {
    db.collection("Member")
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.data().subscribedRSS) {
          dispatch(INITUSERRSSLIST(doc.data().subscribedRSS));
        }
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
        db.collection("Member")
          .doc(user.uid)
          .onSnapshot((doc) => {
            app
              .getMemberRSSFolders(user.uid)
              .then((RSSFolders) => {
                return RSSFolders;
              })
              .then(async (RSSFolders) => {
                for (const folder of RSSFolders) {
                  if (folder.RSSIds) {
                    for (const RSSId of folder.RSSIds) {
                      const RSS = await app.getRSSInfo(RSSId);
                      folder.RSS.push(RSS);
                    }
                  }
                }

                setRSSFolders(RSSFolders);
              });
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
    const RSSFolderList = [];
    if (folders.length > 0) {
      for (const i in folders) {
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
                    <FolderOpenIcon
                      style={{ fontSize: 20, color: "rgba(225,225,225,0.3)" }}
                    />
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

  const articleFolderList = showRSSFolders(RSSFolders);
  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

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
      const newRSSFolders = [...RSSFolders];
      let newRSSIds;

      newRSSFolders.forEach((folder) => {
        if (folder.id === destination.droppableId) {
          const moveId = folder.RSSIds[source.index];
          newRSSIds = [...folder.RSSIds];

          newRSSIds.splice(source.index, 1);

          newRSSIds.splice(destination.index, 0, moveId);

          const moveItem = folder.RSS[source.index];

          folder.RSS.splice(source.index, 1);
          folder.RSS.splice(destination.index, 0, moveItem);

          folder.RSSIds = newRSSIds;
        }
      });

      db.collection("RSSFolders").doc(destination.droppableId).update({
        RSS: newRSSIds,
      });
      setRSSFolders(newRSSFolders);
    }
    if (destination.droppableId !== source.droppableId) {
      const newRSSFolders = [...RSSFolders];

      let moveId;
      let moveItem;
      let newFeedRSSIds;
      let newDestinationRSSIds;
      newRSSFolders.forEach((folder) => {
        if (folder.id === source.droppableId) {
          moveId = folder.RSSIds[source.index];
          moveItem = folder.RSS[source.index];
          newFeedRSSIds = [...folder.RSSIds];
          newFeedRSSIds.splice(source.index, 1);
          folder.RSS.splice(source.index, 1);
          folder.RSSIds = newFeedRSSIds;
          db.collection("RSSFolders").doc(source.droppableId).update({
            RSS: newFeedRSSIds,
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
    <div className={styles.mobileFolderTabWrapper}>
      <div className={styles.mobileFolderTab}>
        <div className={styles.sectionTitle}>Taggy</div>
        <Link to={"/rssexplore"}>
          <div className={styles.importWrapper}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlinedIcon />}
            >
              Add RSS
            </Button>
          </div>
        </Link>

        <Link to={"/home"}>
          <div
            className={
              props.focus === "home"
                ? styles.keyTitleWrapper
                : styles.titleWrapper
            }
          >
            <TrendingUpOutlinedIcon
              fontSize="small"
              className={
                props.focus === "home"
                  ? styles.folderIcon_focus
                  : styles.folderIcon
              }
            />
            <div className={styles.keyTitle}>Today</div>
          </div>
        </Link>
        <Link to={"/home/channels"}>
          <div
            className={
              props.focus === "channels"
                ? styles.keyTitleWrapper
                : styles.titleWrapper
            }
          >
            <ExploreOutlinedIcon
              fontSize="small"
              className={
                props.focus === "channels"
                  ? styles.folderIcon_focus
                  : styles.folderIcon
              }
            />
            <div className={styles.keyTitle}>Explore</div>
          </div>
        </Link>
        <Link to={"/home/myfeeds"}>
          <div
            className={
              props.focus === "myfeeds"
                ? styles.keyTitleWrapper
                : styles.titleWrapper
            }
          >
            <RssFeedIcon
              fontSize="small"
              className={
                props.focus === "myfeeds"
                  ? styles.folderIcon_focus
                  : styles.folderIcon
              }
            />
            <div
              className={styles.keyTitle}
              onClick={() => {
                dispatch(SWITCHRSS("all"));
              }}
            >
              My Feeds
            </div>
          </div>
        </Link>
        <Link to={"/home/searchfeeds"}>
          <div
            className={
              props.focus === "searchfeeds"
                ? styles.keyTitleWrapper
                : styles.titleWrapper
            }
          >
            <SearchIcon
              fontSize="small"
              className={
                props.focus === "searchfeeds"
                  ? styles.folderIcon_focus
                  : styles.folderIcon
              }
            />
            <div className={styles.keyTitle} onClick={() => {}}>
              Search Feeds
            </div>
          </div>
        </Link>
        <div className={styles.subscriptionWrapper}>
          <div className={styles.subscription}>Subscription</div>
          <CustomTooltip title="Add new folder" placement="right" arrow>
            <CreateNewFolderOutlinedIcon
              onClick={() => {
                setShowPage(true);
              }}
              className={styles.setting}
              fontSize="small"
              style={{ color: "#b2b2b2" }}
            />
          </CustomTooltip>
        </div>
        <TreeView
          className={classes.root}
          defaultexpanded={expanded}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            {articleFolderList}
          </DragDropContext>
        </TreeView>

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
                  <div className={styles.addTitle}>Add new folder</div>
                  <div className={styles.addSubTitle}>
                    Create folder to organize RSS resources you love
                  </div>
                  <label className={styles.addFolderLabel} htmlFor="addForm">
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
                            addRSSFolder(addFolderInput, user.uid);
                            setShowPage(false);
                          } else {
                            alert("Please login to add folder!");
                          }
                        }}
                      >
                        Create
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

                  <div className={styles.imgWrapper}>
                    <img src={addRSSFolderImg} alt="" />
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
