import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import TreeItem from "@material-ui/lab/TreeItem";

import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import styles from "./FolderTab.module.css";
import { Skeleton } from "@material-ui/lab";
import { SWITCHARTICLE } from "../../redux/actions";

import { Draggable } from "react-beautiful-dnd";

const useStyles = makeStyles({
  root: {
    background: "#4F4F4F",
  },
});
export default function Folder(props) {
  console.log("rerender la ");
  const classes = useStyles();

  const dispatch = useDispatch();
  const folderTags = props.folderTags;

  function showTabTreeList(tags) {
    const tabList = [];
    if (tags) {
      let count = 0;
      for (const i in tags) {
        tabList.push(
          <Draggable draggableId={tags[i].id} index={count} key={tags[i].id}>
            {(provided) => (
              <TreeItem
                key={tags[i].id}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                nodeId={tags[i].id}
                label={
                  <div className={styles.labelWrapper}>
                    <LocalOfferOutlinedIcon
                      style={{ fontSize: 20, color: "#5B5B5B" }}
                    />
                    {tags[i].label ? (
                      <div className={styles.labelTitle}>{tags[i].label}</div>
                    ) : (
                      <Skeleton
                        className={classes.root}
                        variant="rect"
                        width={100}
                        height={12}
                        animation="pulse"
                      />
                    )}
                  </div>
                }
                onClick={() => {
                  console.log(tags[i].id);
                  dispatch(SWITCHARTICLE(tags[i].id));
                }}
              />
            )}
          </Draggable>
        );
        count++;
      }
    }
    return tabList;
  }
  const tabList = showTabTreeList(folderTags);
  return <div>{tabList}</div>;
}
