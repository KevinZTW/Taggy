import React, { useEffect, useState, useMemo, useRef } from "react";

import { Link } from "react-router-dom";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import frontedWeekly from "../../img/frontendWeekly_box.jpg";
import medium from "../../img/medium_box.png";
import dailydev from "../../img/dailydev_box.png";
import dailyJS from "../../img/dailyJS_box.png";
import airbnb from "../../img/airbnb_box.jpg";
import google from "../../img/google_box.png";
import logrocket from "../../img/logrocket_box.jpg";
import plain from "../../img/plain_english_box.jpg";
import RSSCard from "./RSSCard";
import { db } from "../../firebase.js";
import { INITARTICLE } from "../../redux/actions";
import styles from "./RSSBoard_Explore.module.css";
import { app } from "../../lib/lib.js";
import RSSPage from "./RSSPage";
import RSSChannel from "./RSSChannel";
import "./RSSPage.css";
export default function RSSBoardExplore(props) {
  const [showPage, setShowPage] = useState(false);

  const location = useLocation();
  let search = location.search;
  let params = new URLSearchParams(search);
  let channelId = params.get("channelId");
  console.log(channelId);
  return (
    <div className={styles.boardWrapper}>
      {!channelId ? (
        <div className={styles.board}>
          <h1 className={styles.title}>Explore</h1>
          <div className={styles.description}>
            Discover the best sources for topic you like
          </div>
          <h1 className={styles.boxWrapperTitle}>Feature</h1>
          <div className={styles.boxWrapper}>
            <div className={styles.box}>
              <Link to="?channelId=c21yiUdn1sl4S57BYbr8&title=Airbnb Engineering &amp; Data Science&description=Creative engineers and data scientists building a world where you can belong anywhere. http://airbnb.io">
                <div className={styles.boxImg}>
                  <img src={airbnb} alt="" />
                </div>
                <div className={styles.boxTitle}>
                  Airbnb Engineering &amp; Data Science
                </div>
                <div className={styles.boxDescription}>
                  Creative engineers and data scientists building a world where
                  you can belong anywhere. http://airbnb.io
                </div>
              </Link>
            </div>
            <div className={styles.box}>
              <Link
                to="?channelId=fzKiwTaqX94LqJLuH3bx&title=Google Developers&description=Engineering and technology articles for developers, written
                  and curated by Googlers. The views expressed are those of the
                  authors and don't necessarily reflect those of Google."
              >
                <div className={styles.boxImg}>
                  <img src={google} alt="" />
                </div>
                <div className={styles.boxTitle}>Google Developers</div>
                <div className={styles.boxDescription}>
                  Engineering and technology articles for developers, written
                  and curated by Googlers.
                </div>
              </Link>
            </div>
            <div className={styles.box}>
              <Link to="?channelId=K7eGFfzcCrXErhBPsKM0&title=JavaScript In Plain English - Medium&description=New JavaScript + Web Development articles every day">
                <div className={styles.boxImg}>
                  <img src={plain} alt="" />
                </div>
                <div className={styles.boxTitle}>
                  JavaScript In Plain English - Medium
                </div>
                <div className={styles.boxDescription}>
                  New JavaScript + Web Development articles every day
                </div>
              </Link>
            </div>
            <div className={styles.box}>
              <Link to="?channelId=KcRLeBkx37MWou5HbGKe&title=LogRocket Blog&description=For Frontend Developers and Web App Engineers">
                <div className={styles.boxImg}>
                  <img src={logrocket} alt="" />
                </div>
                <div className={styles.boxTitle}>LogRocket Blog</div>
                <div className={styles.boxDescription}>
                  For Frontend Developers and Web App Engineers
                </div>
              </Link>
            </div>
          </div>
          <h1 className={styles.boxWrapperTitle}>Front End</h1>
          <div className={styles.boxWrapper}>
            <div className={styles.box}>
              <Link
                to="?channelId=9yuVe1n8G20E9VfWngTR&title=Fronted Weekly&description=A curation of all things interesting and related to javascript
                  and front end development."
              >
                <div className={styles.boxImg}>
                  <img src={frontedWeekly} alt="" />
                </div>
                <div className={styles.boxTitle}>Fronted Weekly</div>
                <div className={styles.boxDescription}>
                  A curation of all things interesting and related to javascript
                  and front end development.
                </div>
              </Link>
            </div>
            <div className={styles.box}>
              <Link to="?channelId=I14qjeQLYk4hfxBTW1lF&title=Bits and Pieces&description=The best of web development articles, tutorials, and news.">
                <div className={styles.boxImg}>
                  <img src={medium} alt="" />
                </div>
                <div className={styles.boxTitle}>Bits and Pieces</div>
                <div className={styles.boxDescription}>
                  The best of web development articles, tutorials, and news.
                </div>
              </Link>
            </div>
            <div className={styles.box}>
              <Link
                to="?channelId=vqUF9fbocSHkwYzOi2fY&title=Daily.dev&description=Daily is an open source browser extension which provides curated
                dev news to your new tab"
              >
                <div className={styles.boxImg}>
                  <img src={dailydev} alt="" />
                </div>
                <div className={styles.boxTitle}>Daily.dev</div>
                <div className={styles.boxDescription}>
                  Daily is an open source browser extension which provides
                  curated dev news to your new tab
                </div>
              </Link>
            </div>
            <div className={styles.box}>
              <Link to="?channelId=5L6M2nLNRkXNjjFCu1gB&title=Daily JS&description=JavaScript news and opinion.">
                <div className={styles.boxImg}>
                  <img src={dailyJS} alt="" />
                </div>
                <div className={styles.boxTitle}>Daily JS</div>
                <div className={styles.boxDescription}>
                  JavaScript news and opinion.
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <RSSChannel channelId={channelId} />
      )}
    </div>
  );
}
