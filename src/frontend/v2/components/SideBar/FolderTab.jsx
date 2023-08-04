import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { createPortal } from "react-dom";
import styles from "./FolderTab.module.css";

import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import TrendingUpOutlinedIcon from "@mui/icons-material/FolderOpen";
import ExploreOutlinedIcon from "@mui/icons-material/FolderOpen";
import RssFeedIcon from "@mui/icons-material/FolderOpen";
import SearchIcon from "@mui/icons-material/FolderOpen";
import Tooltip from "@mui/material/Tooltip";

import addRSSFolderImg from "@/public/imgs/add_RSS_folder.png";

import Link from 'next/link'

// [Warning!] This part directly migrate from the old code, need to be refactored

export default function FolderTab(props) {
    
    const [addFolderInput, setAddFolderInput] = useState("");
    const [showPage, setShowPage] = useState(false);
    const [RSSFolders, setRSSFolders] = useState([]);
    const [expanded, setExpanded] = useState([]);
    // const folderstyle = makeStyles({
    //   root: {
    //     paddingLeft: "23px",
    //     paddingBottom: "8px",
    //     maxWidth: 200,
    //     fontSize: "15px important",
    //     marginBottom: "3px",
    //   },
    // });
    // const folderStyle = folderstyle();
    function getUserRSSList(uid) {
      db.collection("Member")
        .doc(uid)
        .get()
        .then((doc) => {
          if (doc.data()) {
            if (doc.data().subscribedRSS) {
              dispatch(INITUSERRSSLIST(doc.data().subscribedRSS));
            }
          }
        });
    }
    // TODO: add user and it's list
    const user = undefined;
    const userRSSList = [];
    
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
                  for (const i in RSSFolders) {
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
            <Droppable droppableId={folders[i].id} key={folders[i].id}>
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
      <div className={styles.folderTabWrapper}>
        <div className={styles.folderTab}>
          <div className={styles.sectionTitle}>Taggy</div>
          <Link href={"/rss/search"}>
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
  
          <Link href={"/rss/latest"}>
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
              <div className={styles.keyTitle}>Latest</div>
            </div>
          </Link>
          <Link href={"/rss/feeds"}>
            <div
              className={
                props.focus === "feeds"
                  ? styles.keyTitleWrapper
                  : styles.titleWrapper
              }
            >
              <ExploreOutlinedIcon
                fontSize="small"
                className={
                  props.focus === "feeds"
                    ? styles.folderIcon_focus
                    : styles.folderIcon
                }
              />
              <div className={styles.keyTitle}>RSS Feeds</div>
            </div>
          </Link>
          <Link href={"/timeline"}>
            <div
              className={
                props.focus === "myitems"
                  ? styles.keyTitleWrapper
                  : styles.titleWrapper
              }
            >
              <RssFeedIcon
                fontSize="small"
                className={
                  props.focus === "timeline"
                    ? styles.folderIcon_focus
                    : styles.folderIcon
                }
              />
              <div
                className={styles.keyTitle}
                onClick={() => {
                  
                }}
              >
                Timeline
              </div>
            </div>
          </Link>
          <Link href={"/home/searchitems"}>
            <div
              className={
                props.focus === "searchitems"
                  ? styles.keyTitleWrapper
                  : styles.titleWrapper
              }
            >
              <SearchIcon
                fontSize="small"
                className={
                  props.focus === "searchitems"
                    ? styles.folderIcon_focus
                    : styles.folderIcon
                }
              />
              <div className={styles.keyTitle} onClick={() => {}}>
                Search RSS Feed
              </div>
            </div>
          </Link>
          <div className={styles.subscriptionWrapper}>
            <div className={styles.subscription}>Subscription</div>
            <Tooltip title="Add new folder" placement="right" arrow sx={{  color: "white",
    fontFamily: "Open Sans",fontSize: 14,}}>
              <CreateNewFolderOutlinedIcon
                onClick={() => {
                  setShowPage(true);
                }}
                className={styles.setting}
                fontSize="small"
                style={{ color: "#b2b2b2" }}
              />
            </Tooltip>
          </div>
          <TreeView
            // className={classes.root}
            defaultexpanded={expanded}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {/* <DragDropContext onDragEnd={onDragEnd}>
              {articleFolderList}
            </DragDropContext> */}
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
                      <img src={addRSSFolderImg.src} alt="" />
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
