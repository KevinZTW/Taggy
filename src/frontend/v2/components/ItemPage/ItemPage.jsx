import { Zoom } from "react-toastify";

import ItemCard from "@/components/ItemCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Chip } from "@mui/material";
import { toast } from "react-toastify";
import ArrowBack from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Tooltip from "@mui/material/Tooltip";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

import styles from "./ItemPage.module.css";


export default function ItemPage({ item, goBack }) {
  console.log("item", item)
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function getItemTags(itemId) {
      const response = await fetch(
        `/api/tags/?itemId=${itemId}`
      );
      return response.json();
    }
    
    if (item) {
      getItemTags(item.id).then(
        data => {setTags(data)}
      );
    }
  }, [item]);

  function renderItemTags(tags) {
    const tagChips = [];
    if (tags) {
      tags.forEach((tag) => {
        tagChips.push(
          <Chip
            size="small"
            label={"#" + tag.name}
            style={{
              marginRight: "6px",
              border: "solid 1px white",
              color: "white",
            }}
            variant="outlined"
          />
        );
      });
    }
    return tagChips;
  }
  function renderMoreItems(items) {
    const moreItems = [];
    if (items) {
      items.forEach((item) => {
        moreItems.push(
          <ItemCard
            item={item}
            // onClick={() => {
            //   setNewItem(item);
            //   document
            //     .querySelector("#ItemPage")
            //     [`scrollTo`]({ top: 0, behavior: `smooth` });
            // }}
          />
        );
      });
    }
    return moreItems;
  }
  const user = {
    uid: 123,
  }

  const tagChips = renderItemTags(tags);
  // const moreItems = renderMoreItems(tags.items);
  return (
    item ? (
    <div>
        <div className={styles.page} id="ItemPage">
          <div className={styles.head}>
            <div className={styles.arrowWrapper} onClick={goBack}>
              <ArrowBack
                className={styles.Icon}
                style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
              />
            </div>
            <Tooltip title="save to my board" placement="right" arrow sx={{color: "white",
    fontFamily: "Open Sans", fontSize: 14}}>
              <div
                className={styles.arrowWrapper}
                onClick={() => {
                  alert("TODO: implement save to my board")
                }}
              >
                <BookmarkBorderIcon
                  className={styles.Icon}
                  style={{ color: "rgba(255,255,255, 0.6)", cursor: "pointer" }}
                />
              </div>
            </Tooltip>
          </div>
          <div className={styles.title}>{item?.title}</div>
          <div className={styles.chipsWrapper}>{tagChips}</div>
          
          <a href={item.url}>Visit origin content here!</a>
          <div
            dangerouslySetInnerHTML={{
              __html:
                 item.content || item["content:encoded"] || "oops, we don't have content snippet for this item",
            }}
            className={styles.content}
          ></div>
          <div className={styles.more}>More from Taggy</div>
        </div>
    </div>
  ): (<div>loading...</div>));
}
