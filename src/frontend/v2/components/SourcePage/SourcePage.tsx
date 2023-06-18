import React, { useEffect, useState } from "react";
import Link from 'next/link'

import ArrowBack from "@mui/icons-material/ArrowBack";

import FeedCard from "@/components/FeedCard";

import styles from "./SourcePage.module.css";
import FeedPage from "@/components/FeedPage";

import { RSSFeed, RSSSource } from '@/protos/taggy';

import ApiGateway from '@/gateways/Api.gateway';
// [Warning!] This part directly migrate from the old code, need to be refactored
// in v1 this was called RSSChannel


export default function SourcePage({ source } : {source: RSSSource}) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [allFeeds, setAllFeeds] = useState<Array<RSSFeed>>();

  const [lastVisible, setLastVisible] = useState(0);
  const [showPage, setShowPage] = useState(false);
  const [feedItem, setFeedItem] = useState<RSSFeed>();
  const [feeds, setFeeds] = useState<Array<RSSSource>>()

  const channelTitle = source?.name
  const channelDescription = source?.description
  const sourceId = source?.id

  useEffect(() => {
    if (!sourceId) return;
    console.log(sourceId)
    ApiGateway.listRSSSourceFeeds(sourceId).then(data => {setAllFeeds(data)})      
  }, [sourceId])

  const user = { uid: "123" }
    //   TODO
  const userSubSourceList = []


  function renderAllFeeds(feeds : RSSFeed[]) {
    if (feeds) {
      const feedList = [];
      for (const i in feeds) {
        feedList.push(
          <FeedCard
            feed={feeds[i]}
            onClick={(e) => {
              setShowPage(true);
              setFeedItem(feeds[i]);
            }}
          />
        );
      }
      return (
        <div className={styles.board}>
          <Link href="/home/channels" className={styles.arrowBack}>
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
          {feedList}
        </div>
      );
    }
  }

  function renderFeedPage(feedItem) {
    return (
      <FeedPage
        item={feedItem}
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

  // TODO: handle userSubSourceList

  // useEffect(() => {
  //   if (userSubSourceList) {
  //     if (userSubSourceList.includes(props.channelId)) {
  //       setIsFollowed(true);
  //     }
  //   }
  // }, [userSubSourceList]);
  

  const feedPage = renderFeedPage(feedItem);
  const allFeedsOutome = renderAllFeeds(allFeeds);
  return (
    <div>
      {allFeedsOutome}
      {showPage ? (
        <div className={styles.popup}>
          <div
            className={styles.blur}
            onClick={() => {
              setShowPage(false);
            }}
          ></div>
          {feedPage}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
