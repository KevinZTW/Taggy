import { useLocation, useHistory } from "react-router-dom";
import MD from "./MD";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, CheckFirebaseUserStatus } from "../../firebase.js";
import ArrowBack from "@material-ui/icons/ArrowBack";
import styles from "../../css/Article.module.css";

export default function Article() {
  let [article, setArticle] = useState({});
  const location = useLocation();
  let search = location.search;
  let params = new URLSearchParams(search);
  let id = params.get("id");

  CheckFirebaseUserStatus("/signup");
  useEffect(() => {
    function getArticles() {
      db.collection("Articles")
        .doc(id)
        .get()
        .then(function (doc) {
          setArticle({
            title: doc.data().title,
            markDown: doc.data().markDown,
          });
        });
    }
    getArticles();
  }, []);

  return (
    <div>
      <div className={styles.head}>
        <Link to={"/board"}>
          <ArrowBack style={{ color: "#FFFCEC" }} />
        </Link>
      </div>
      <div className={styles.title}>{article.title}</div>
      <MD content={article.markDown} id={id} />
    </div>
  );
}
