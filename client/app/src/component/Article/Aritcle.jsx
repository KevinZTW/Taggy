import { useLocation, useHistory } from "react-router-dom";
import MD from "./MD";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, CheckFirebaseUserStatus } from "../../firebase.js";
import ArrowBack from "@material-ui/icons/ArrowBack";
import styles from "../../css/Article.module.css";
import { app } from "../../lib.js";
export default function Article() {
  let [article, setArticle] = useState({});
  let [tagInput, setTagInput] = useState("");
  const location = useLocation();
  let search = location.search;
  let params = new URLSearchParams(search);
  let id = params.get("id");

  useEffect(() => {
    function getArticles() {
      db.collection("Articles")
        .doc(id)
        .onSnapshot(function (doc) {
          setArticle({
            title: doc.data().title,
            markDown: doc.data().markDown,
          });
        });
    }
    getArticles();
  }, []);
  console.log("hihi");
  app.inputTag();
  function findTag(name) {}

  function addTag(tagName, articleId, uid) {}
  return (
    <div>
      <div className={styles.head}>
        <Link to={"/board"}>
          <ArrowBack style={{ color: "#FFFCEC" }} />
        </Link>
      </div>
      <div className={styles.title}>{article.title}</div>
      <div className={styles.tagWrapper}>
        <div className={styles.tag}>important</div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(tagInput);
          }}
        >
          <input
            type="text"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.currentTarget.value);
            }}
            className={styles.addTag}
            placeholder="Add Tag..."
          />
        </form>
      </div>
      <MD content={article.markDown} id={id} />
    </div>
  );
}
