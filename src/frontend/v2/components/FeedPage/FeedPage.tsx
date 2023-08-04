import React, { useEffect, useState } from "react";
import Link from 'next/link'

import ArrowBack from "@mui/icons-material/ArrowBack";

import ItemCard from "@/components/ItemCard";

import styles from "./FeedPage.module.css";
import ItemPage from "@/components/ItemPage";

import { RSSItem, RSSFeed } from '@/protos/taggy';

import ApiGateway from '@/gateways/Api.gateway';
// [Warning!] This part directly migrate from the old code, need to be refactored
// in v1 this was called RSSChannel


export default function FeedPage({ source } : {source: RSSFeed}) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [allItems, setAllItems] = useState<Array<RSSItem>>();

  const [lastVisible, setLastVisible] = useState(0);
  const [showPage, setShowPage] = useState(false);
  const [itemItem, setItemItem] = useState<RSSItem>();


  console.log(source)
  const channelTitle = source?.name
  const channelDescription = source?.description
  const sourceId = source?.id

  useEffect(() => {
    if (!sourceId) return;
    console.log(sourceId)
    ApiGateway.listRSSFeedItems(sourceId).then(data => {setAllItems(data)})
  }, [sourceId])

  const user = { uid: "123" }
    //   TODO
  const userSubFeedList = []


  function renderAllItems(items : RSSItem[]) {
    if (items) {
      const itemList = [];
      for (const i in items) {
        itemList.push(
          <ItemCard
            item={items[i]}
            onClick={(e) => {
              setShowPage(true);
              setItemItem(items[i]);
            }}
          />
        );
      }
      return (
        <div className={styles.board}>
          <Link href="/rss/feeds" className={styles.arrowBack}>
            <ArrowBack style={{ color: "#FFFCEC" }} />
          </Link>
          <h1 className={styles.title}>{channelTitle} </h1>
          <div className={styles.channelDescription}>{channelDescription}</div>
          {isFollowed ? (
            <div className={styles.channelSubscribed}>Following</div>
          ) : (
            <div
              className={styles.channelSubscribe_btn}
              onClick={() => {
                alert("TODO: addRSSToMember")
              }}
            >
              Follow
            </div>
          )}
          {itemList}
        </div>
      );
    }
  }

  function renderItemPage(item : RSSItem) {
    return (
      <ItemPage
        item={item}
        onClick={() => {
          setShowPage(false);
        }}
      />
    );
  }

  useEffect(() => {
    const handleScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;

      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (winScroll > height - 20) {
        const newLast = lastVisible + 7;
        setLastVisible(newLast);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastVisible]);

  // TODO: handle userSubFeedList

  // useEffect(() => {
  //   if (userSubFeedList) {
  //     if (userSubFeedList.includes(props.channelId)) {
  //       setIsFollowed(true);
  //     }
  //   }
  // }, [userSubFeedList]);
  

  const itemPage = renderItemPage(itemItem);
  const allItemsOutome = renderAllItems(allItems);
  return (
    <div>
      {allItemsOutome}
      {showPage ? (
        <div className={styles.popup}>
          <div
            className={styles.blur}
            onClick={() => {
              setShowPage(false);
            }}
          ></div>
          {itemPage}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
