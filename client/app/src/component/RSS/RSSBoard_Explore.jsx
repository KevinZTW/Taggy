import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import frontedWeekly from "../../img/frontendWeekly_box.jpg";
import medium from "../../img/medium_box.png";
import dailydev from "../../img/dailydev_box.png";
import dailyJS from "../../img/dailyJS_box.png";
import RSSCard from "./RSSCard";
import { db } from "../../firebase.js";
import { INITARTICLE } from "../../redux/actions";
import styles from "./RSSBoard_Explore.module.css";
import { app } from "../../lib/lib.js";
import RSSPage from "./RSSPage";
import "./RSSPage.css";
export default function RSSBoardExplore(props) {
  const [showPage, setShowPage] = useState(false);

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.board}>
        <h1 className={styles.title}>Explore</h1>
        <div className={styles.description}>
          Discover the best sources for any topic
        </div>
        <h1 className={styles.boxWrapperTitle}>Feature</h1>
        <div className={styles.boxWrapper}>
          <div className={styles.box}>
            <div className={styles.boxImg}>
              <img src={frontedWeekly} alt="" />
            </div>
            <div className={styles.boxTitle}>Fronted Weekly</div>
            <div className={styles.boxDescription}>
              A curation of all things interesting and related to javascript and
              front end development.
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxImg}>
              <img src={medium} alt="" />
            </div>
            <div className={styles.boxTitle}>Bits and Pieces</div>
            <div className={styles.boxDescription}>
              The best of web development articles, tutorials, and news.
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxImg}>
              <img src={dailydev} alt="" />
            </div>
            <div className={styles.boxTitle}>Daily.dev</div>
            <div className={styles.boxDescription}>
              Daily is an open source browser extension which provides curated
              dev news to your new tab
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxImg}>
              <img src={dailyJS} alt="" />
            </div>
            <div className={styles.boxTitle}>Daily JS</div>
            <div className={styles.boxDescription}>
              JavaScript news and opinion.
            </div>
          </div>
        </div>
      </div>
      {showPage ? (
        <div className={styles.popup}>
          <div
            className={styles.blur}
            onClick={() => {
              setShowPage(false);
            }}
          ></div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
