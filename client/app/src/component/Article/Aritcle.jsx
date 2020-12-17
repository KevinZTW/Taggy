import { useLocation, useHistory } from "react-router-dom";
import React from "react";
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
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      background: "black",
      borderBottom: "1px solid gray",
      color: "white",
      padding: 10,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.color
          : isFocused
          ? "#dcdcdc"
          : null,
        color: isFocused ? "#39382e" : "#dcdcdc",

        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled && (isSelected ? data.color : "green"),
        },
      };
    },
    control: (styles) => ({
      ...styles,
      backgroundColor: "#121212",
      minWidth: "300px",
    }),
  };
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
    let unsubscribe;
    let getArticles = function () {
      unsubscribe = db
        .collection("Articles")
        .doc(id)
        .onSnapshot(function (doc) {
          if (doc.data() !== undefined) {
            setArticle({
              title: doc.data().title,
              readerHtml: doc.data().readerHtml,
            });
          }
        });
    };
    getArticles();
    return () => {
      unsubscribe();
    };
  }, []);
  function uploadNote(input) {
    db.collection("Articles").doc(id).update({
      note: input,
    });
  }
  function getNote(id) {
    db.collection("Articles")
      .doc(id)
      .onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
      });
  }
  const quillRef = React.useRef();

  return (
    <div className={styles.articleWrapper}>
      <img
        data-src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d072fabce4c74b95a416ced1d5743949~tplv-k3u1fbpfcp-zoom-1.image"
        alt=""
      />
      <div className={styles.head}>
        <Link to={"/board"}>
          <ArrowBack style={{ color: "#FFFCEC" }} />
        </Link>
      </div>
      <div className={styles.title}>{article.title}</div>
      <div className={styles.tagWrapper}>
        <CreatableSelect
          isMulti
          width="200px"
          menuColor="red"
          styles={customStyles}
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
            className={styles.quill1}
            onChangeSelection={(a, b, c) => {
              console.log(a);
              console.log(b);
              console.log(c);
            }}
            theme="snow"
            ref={(el) => {
              quillRef.current = el;
            }}
            value={note}
            onChange={(e) => {
              uploadNote(note);
              setNote(e);
            }}
          />
        </div>
      </div>
    </div>
  );
}
