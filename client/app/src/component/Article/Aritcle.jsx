import { useLocation, useHistory } from "react-router-dom";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, CheckFirebaseUserStatus } from "../../firebase.js";
import ArrowBack from "@material-ui/icons/ArrowBack";
import styles from "../../css/Article.module.css";
import { app } from "../../lib/lib.js";
import ReactQuill from "react-quill";
import CreatableSelect from "react-select/creatable";
import { useSelector } from "react-redux";
import "react-quill/dist/quill.snow.css";
export default function Article() {
  let [tags, setTags] = useState({});
  let [article, setArticle] = useState({});
  let [note, setNote] = useState("");
  const location = useLocation();
  let search = location.search;
  let params = new URLSearchParams(search);
  let id = params.get("id");
  let user = useSelector((state) => {
    return state.memberReducer.user;
  });
  useEffect(() => {
    if (user) {
      console.log("useeffect run");

      app.initArticleTags(id, user.uid).then((articleTagSelection) => {
        console.log(articleTagSelection);
        setTags(articleTagSelection);
      });
    }
  }, [user]);
  function handleChange(newValue, actionMeta) {
    switch (actionMeta.action) {
      case "select-option":
        console.log("select option!");
        app.inputTag(id, user.uid, actionMeta.option.label);
        setTags({ ...tags, values: newValue });
        break;
      case "remove-value":
        app.deleteTagFromArticle(id, user.uid, actionMeta.removedValue.tagId);
        setTags({ ...tags, values: newValue });
        break;
      default:
        console.group("Value Changed");
        console.log("newvalueis ", newValue);

        console.dir(`action: ${actionMeta.action}`);
        console.dir(actionMeta.removedValue);
        console.groupEnd();
    }
  }

  function handleCreate(inputValue) {
    console.group("Option created");

    console.log(tags);
    app.inputTag(id, user.uid, inputValue);
    setTags({
      options: [...tags.options, { label: inputValue, value: inputValue }],
      values: [...tags.values, { label: inputValue, value: inputValue }],
    });
    console.log(tags);
    console.groupEnd();
  }
  useEffect(() => {
    function getArticles() {
      db.collection("Articles")
        .doc(id)
        .onSnapshot(function (doc) {
          if (doc.data() !== undefined) {
            setArticle({
              title: doc.data().title,
              readerHtml: doc.data().readerHtml,
            });
          }
        });
    }
    getArticles();
  }, []);

  return (
    <div className={styles.articleWrapper}>
      <div className={styles.head}>
        <Link to={"/board"}>
          <ArrowBack style={{ color: "#FFFCEC" }} />
        </Link>
      </div>
      <div className={styles.title}>{article.title}</div>
      <div className={styles.tagWrapper}>
        <CreatableSelect
          isMulti
          onChange={handleChange}
          onCreateOption={handleCreate}
          options={tags.options}
          defaultValue={tags.values}
          value={tags.values}
        />
      </div>
      <div className={styles.articleMain}>
        <div
          className={styles.articleBody}
          dangerouslySetInnerHTML={{ __html: article.readerHtml }}
        ></div>
        <div className={styles.note}>
          <div>Your Summary</div>
          <ReactQuill
            theme="snow"
            value={note}
            onChange={(e) => {
              setNote(e);
            }}
          />
        </div>
      </div>
    </div>
  );
}
