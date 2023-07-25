
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router'

import { RSSItem } from '@/protos/taggy';

import FeedPage from '@/components/FeedPage';
import ItemCard from '@/components/ItemCard';
import FeedCard from '@/components/FeedCard/FeedCard';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import ApiGateway from '@/gateways/Api.gateway';

import styles from "./index.module.css";
import ItemPage from '@/components/ItemPage/ItemPage';

const BackEndCategory = "Back-End";
const FrontEndCategory = "Front-End";
const ProductManagmentCategory = "Product Managment";
const UIUXCategory = "UI/UX";
const TechNewsCategory = "Tech News";

export default function RSSFeedPage(){
    const [selectCategory, setSelectCategory] = useState(BackEndCategory);
    const [showPage, setShowPage] = useState(false);
    const [items, setItems] = useState<RSSItem[]>([])
    const [shownItem, setShownItem] = useState<RSSItem>()
    const [page, setPage] = useState<number>(0)
    const itemsLimit = 20;

    useMemo(() => {
        setPage(0);
        setItems([]);
      }, [selectCategory]);

    function getMoreItems(){
        ApiGateway.listRSSItems(page, itemsLimit).then(data => {
            setItems([...items, ...data]);
            setPage(page + 1);
        })
    }

    useEffect(()=>{
        getMoreItems();
    }, [])
    

    function renderAllItems(items : RSSItem[]) {

        const itemList = [];
        for (const i in items) {
            itemList.push(
            <ItemCard
              key={items[i].id}
              item={items[i]}
              onClick={(e) => {
                setShownItem(items[i]);
                setShowPage(true);
            }}
            />
        );
        }
        return itemList;
      }

    function renderFeedPage(item : RSSItem) {
        return (
          <ItemPage
            item={item}
            goBack={() => {
              setShowPage(false);
            }}
          />
        );
      }

    let itemsList = renderAllItems(items);
    let itemPage = renderFeedPage(shownItem);

    return (
        <div className={styles.boardWrapper}>

<div className={styles.board}>
        <h1 className={styles.title}>Today</h1>
        <div className={styles.description}>
          Trendy feeds from top blogs selected by Taggy
        </div>
        <div className={styles.switchWrapper}>
          {/* <div
            className={
              selectCategory === "Front End"
                ? styles.switchTitleFocus
                : styles.switchTitle
            }
            onClick={() => {
              setSelectCategory("Front End");
            }}
          >
            Front-End Tech
          </div> */}
          <div
            className={
              selectCategory === BackEndCategory
                ? styles.switchTitleFocus
                : styles.switchTitle
            }
            onClick={() => {
              setSelectCategory(BackEndCategory);
            }}
          >
            Back-End Tech
          </div>
          {/* <div
            className={
              selectCategory === "Product Managment"
                ? styles.switchTitleFocus
                : styles.switchTitle
            }
            onClick={() => {
              setSelectCategory("Product Managment");
            }}
          >
            Product Managment
          </div>
          <div
            className={
              selectCategory === "UI/UX"
                ? styles.switchTitleFocus
                : styles.switchTitle
            }
            onClick={() => {
              setSelectCategory("UI/UX");
            }}
          >
            User Experience
          </div>
          <div
            className={
              selectCategory === "Tech News"
                ? styles.switchTitleFocus
                : styles.switchTitle
            }
            onClick={() => {
              setSelectCategory("Tech News");
            }}
          >
            Tech News
          </div> */}
        </div>

        {itemsList}
      </div>

      
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
    )
}