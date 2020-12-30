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
import { app } from "../../lib/lib.js";
import { useDispatch } from "react-redux";
import {
  SWITCHARTICLE,
  GROUPINIT,
  INITGROUPSELECT,
  SWITCHGROUPSELECT,
} from "../../redux/actions";
import { db } from "../../firebase.js";
import firebase from "firebase/app";
import { DragDropContext } from "react-beautiful-dnd";

import GroupFolerSub from "./GroupFolderSub";

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
  const [tabChange, setTabChange] = useState("");
  const [editFolder, setEditFolder] = useState(false);
  const [addGroup, setAddGroup] = useState(false);
  const [addGroupInput, setAddGroupInput] = useState("");
  const [addFolderInput, setAddFolderInput] = useState("");
  const [articleFolders, setArticleFolders] = useState([]);

  const groups = useSelector((state) => {
    return state.groupReducer.groups;
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
      //console.log("nothing should happended");
      return;
    }
    if (destination.droppableId === source.droppableId) {
      //console.log("move inside same folder");
      const newArticleFolders = [...articleFolders];
      newArticleFolders.forEach((folder) => {
        if (folder.id === destination.droppableId) {
          //console.log("hihi");
          const newTags = [...folder.tags];
          const moveItem = { ...newTags[source.index] };
          //console.log(moveItem);
          newTags.splice(source.index, 1);
          newTags.splice(destination.index, 0, moveItem);
          //console.log(newTags);
          folder.tags = newTags;
          const firestoreTagArr = [];
          newTags.forEach((tag) => {
            firestoreTagArr.push(tag.id);
          });
          //console.log(firestoreTagArr);
          db.collection("articleFolders").doc(destination.droppableId).update({
            tags: firestoreTagArr,
          });
        }
      });
      setArticleFolders(newArticleFolders);
      //console.log(destination.index, source.index);
      //console.log(source.droppableId);
      //console.log(destination.droppableId);
    }
    if (destination.droppableId !== source.droppableId) {
      //console.log("move to another folder");
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
          //console.log(firestoreTagArr);
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
          //console.log(firestoreTagArr);
          db.collection("articleFolders").doc(destination.droppableId).update({
            tags: firestoreTagArr,
          });
        }
      });
      setArticleFolders(newArticleFolders);
    }
  }

  useEffect(() => {
    function getMemberGroups(user) {
      return db
        .collection("Member")
        .doc(user.uid)
        .get()
        .then((doc) => {
          //console.log(doc.data());
          return doc.data().board;
        });
    }
    function getGroupDbInfo(boardId) {
      //console.log(boardId);
      return db
        .collection("GroupBoard")
        .doc(boardId)
        .get()
        .then((doc) => {
          return {
            id: doc.data().id,
            name: doc.data().name,
            articleFolders: doc.data().articleFolders,
          };
        });
    }
    async function memberGroupInit(user) {
      const groupIds = await getMemberGroups(user);

      const groups = {};
      //console.log(groupIds);
      for (const i in groupIds) {
        const info = await getGroupDbInfo(groupIds[i]);
        groups[groupIds[i]] = info;
      }
      console.warn(groups);
      if (groups[Object.keys(groups)[0]]) {
        console.warn(groups[Object.keys(groups)[0]].id);
        dispatch(
          INITGROUPSELECT(
            groups[Object.keys(groups)[0]].id,
            groups[Object.keys(groups)[0]].name
          )
        );
      }

      //=========!!!!!!!!!!!!!!!!!!!===========
      // dispatch(GROUPINIT(groups));

      for (const i in groupIds) {
        const info = await getGroupDbInfo(groupIds[i]);
        //info ={  id: "group1",
        //name: front end,
        //articleFolders: [id1, id2, id3],}
        const folders = await app.getGroupArticleFolders(groupIds[i]);
        //folders=[{id, name, tags}, {id, name, tags}]
        //console.log(folders);
        const folderWithTagInfo = folders.map(async (folder) => {
          const tags = await app.getMemberFolderTags(folder.id);
          folder.tags = tags;
          return folder;
        });

        const group = await Promise.all(folderWithTagInfo).then((folder) => {
          info.articleFolders = folder;
          return info;
        });
        //console.log(group);
        const groupId = groupIds[i];
        groups[groupId] = group;
        //console.log(groups);
      }
      //console.log(groups);

      dispatch(GROUPINIT(groups));
    }
    async function updateMemberGroup(user, changeId) {
      const groupIds = await getMemberGroups(user);
      const groups = {};
      //console.log(groupIds);
      for (const i in groupIds) {
        const info = await getGroupDbInfo(groupIds[i]);
        groups[groupIds[i]] = info;
      }
      //console.log(groups);
      //console.log(changeId);
      dispatch(SWITCHGROUPSELECT(groups[changeId].id, groups[changeId].name));
      //=========!!!!!!!!!!!!!!!!!!!===========
      // dispatch(GROUPINIT(groups));

      for (const i in groupIds) {
        const info = await getGroupDbInfo(groupIds[i]);
        //info ={  id: "group1",
        //name: front end,
        //articleFolders: [id1, id2, id3],}
        const folders = await app.getGroupArticleFolders(groupIds[i]);
        //folders=[{id, name, tags}, {id, name, tags}]
        //console.log(folders);
        const folderWithTagInfo = folders.map(async (folder) => {
          const tags = await app.getMemberFolderTags(folder.id);
          folder.tags = tags;
          return folder;
        });

        const group = await Promise.all(folderWithTagInfo).then((folder) => {
          info.articleFolders = folder;
          return info;
        });
        //console.log(group);
        const groupId = groupIds[i];
        groups[groupId] = group;
        //console.log(groups);
      }
      //console.log(groups);

      dispatch(GROUPINIT(groups));
    }
    if (tabChange) {
      updateMemberGroup(user, tabChange).then(() => {});
    } else if (user) {
      memberGroupInit(user).then((groups) => {});
    }
  }, [user, tabChange]);

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
  function addGroupBoard(name, uid) {
    db.collection("GroupBoard")
      .add({
        name: name,
        member: [uid],
      })
      .then((docRef) => {
        docRef.update({ id: docRef.id, articleFolders: ["un" + docRef.id] });
        return docRef.id;
      })
      .then((id) => {
        db.collection("Member")
          .doc(uid)
          .update({
            board: firebase.firestore.FieldValue.arrayUnion(id),
          });
        return id;
      })
      .then((id) => {
        db.collection("articleFolders")
          .doc("un" + id)
          .set({
            id: "un" + id,
            name: "Uncategorized",
          });
        return id;
      })
      .then((id) => {
        setTabChange(id);
      });
  }
  function renderGroupTabs(groups) {
    const groupTabs = [];
    //console.log(groups);
    for (const key in groups) {
      //console.log(groups[key]);
      groupTabs.push(
        <TreeView
          className={classes.root}
          defaultExpanded={[""]}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onClick={() => {
            //console.log(groups[key].name);
            dispatch(SWITCHGROUPSELECT(key, groups[key].name));
          }}
        >
          <TreeItem
            nodeId={groups[key].name}
            label={
              <div className={styles.labelWrapper}>
                <PeopleAltIcon />
                <div className={styles.labelTitle}>{groups[key].name}</div>
              </div>
            }
            onClick={() => {
              //console.log("all");
              dispatch(SWITCHARTICLE("all"));
            }}
          >
            <TreeItem
              nodeId={"tagAll_" + groups[key].name}
              label={
                <div className={styles.labelWrapper}>
                  <div className={styles.labelTitle}>All Articles</div>
                </div>
              }
              onClick={() => {
                //console.log("all");
                dispatch(SWITCHARTICLE("all"));
              }}
            ></TreeItem>
            {/* <TreeItem
              nodeId="unTag2"
              label={
                <div className={styles.labelWrapper}>
                  <MarkunreadIcon style={{ fontSize: 20, color: "#5B5B5B" }} />
                  <div className={styles.labelTitle}>Untaged</div>
                </div>
              }
            /> */}
            <DragDropContext onDragEnd={onDragEnd}>
              <GroupFolerSub folders={groups[key].articleFolders} />
            </DragDropContext>
          </TreeItem>
        </TreeView>
      );
    }
    return groupTabs;
  }
  const groupTabs = renderGroupTabs(groups);
  // const articleFolderList = showArticleFolders(articleFolders);
  // const allTabList = showTabTreeList(tabs);

  return (
    <div className={styles.folderTabWrapper}>
      <div className={styles.folderTab}>
        <div className={styles.sectionTitle}>Group Boards</div>
        <div
          className={styles.subTitle}
          onClick={() => {
            setAddGroup(true);
          }}
        >
          Create New Group
        </div>
        {groupTabs}

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
        {addGroup
          ? createPortal(
              <div className={styles.popup}>
                <div
                  className={styles.blur}
                  onClick={() => {
                    setAddGroup(false);
                  }}
                ></div>
                <div className={styles.addFolder}>
                  <div className={styles.addTitle}>Create New Group Board</div>
                  <form id="addForm" action="">
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Group Board Name"
                      value={addGroupInput}
                      onChange={(e) => {
                        setAddGroupInput(e.target.value);
                      }}
                    />
                    <button
                      type="submit"
                      className={styles.saveBtn}
                      form="addForm"
                      onClick={() => {
                        if (user) {
                          addGroupBoard(addGroupInput, user.uid);
                          setAddGroup(false);
                        } else {
                          alert("Please login to add group!");
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setAddGroup(false);
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
      </div>
    </div>
  );
}
