import TreeItem from "@material-ui/lab/TreeItem";

import { useDispatch } from "react-redux";
import styles from "../SideTab/FolderTab.module.css";
import { Draggable } from "react-beautiful-dnd";
import { SWITCHRSS } from "../../redux/actions";
import { Link } from "react-router-dom";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
export default function RSSFolder(props) {
  const dispatch = useDispatch();

  function showRSSItem(RSS) {
    const RSSList = [];
    if (RSS.length > 0) {
      let count = 0;
      for (const i in RSS) {
        RSSList.push(
          <Draggable draggableId={RSS[i].id} index={count} key={RSS[i].id}>
            {(provided) => (
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
              >
                <Link to={"/home/myfeeds"}>
                  <TreeItem
                    className={styles.treeItem}
                    key={RSS[i].id}
                    nodeId={RSS[i].id}
                    label={
                      <div className={styles.labelWrapper}>
                        <LocalOfferOutlinedIcon
                          style={{
                            fontSize: 20,
                            color: "rgba(225,225,225,0.3)",
                          }}
                        />
                        <div className={styles.labelTitle}>{RSS[i].title}</div>
                      </div>
                    }
                    onClick={() => {
                      dispatch(SWITCHRSS(RSS[i].id));
                    }}
                  />
                </Link>
              </div>
            )}
          </Draggable>
        );
        count++;
      }
    }
    return RSSList;
  }
  const RSSList = showRSSItem(props.folderRSS);

  return <div>{RSSList}</div>;
}
