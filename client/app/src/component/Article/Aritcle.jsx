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
import { render } from "react-dom";
export default function Article() {
  let [tags, setTags] = useState({});
  let [note, setNote] = useState("");
  let [article, setArticle] = useState({});

  const [renderArticle, setRenderArticle] = useState(article.readerHtml);
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
    let unsubscribeNote;
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
            setRenderArticle(doc.data().readerHtml);
          }
        });
    };
    function noteUpdateListener(id) {
      unsubscribeNote = db
        .collection("Articles")
        .doc(id)
        .onSnapshot((doc) => {
          if (doc.data().note) {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            console.log(source, " data: ", doc.data().note);
            if (doc.data().note !== note) {
              setNote(doc.data().note);
            }
          }
        });
    }
    noteUpdateListener(id);
    getArticles();
    return () => {
      unsubscribe();
      unsubscribeNote();
    };
  }, []);
  function uploadNote(input) {
    db.collection("Articles")
      .doc(id)
      .update({
        note: input,
      })
      .then(() => {
        console.log("save!");
      });
  }

  function findIndexInArticle(
    articleString,
    startIndex,
    startTextContent,
    endIndex,
    endTextContent
  ) {
    let articleStart = articleString.indexOf(startTextContent) + startIndex;
    let articleStartTail =
      articleString.indexOf(startTextContent) + startTextContent.length;
    let articleEnd = articleString.indexOf(endTextContent) + endIndex;
    let articleEndHead = articleString.indexOf(endTextContent);
    return {
      articleStart: articleStart,
      articleStartTail: articleStartTail,
      articleEnd: articleEnd,
      articleEndHead: articleEndHead,
    };
  }
  function handleMouseUp() {
    console.log(renderArticle);
    var selection = window.getSelection();
    // console.log(selection.getRangeAt(0).extractContents());
    let dom = selection.getRangeAt(0).cloneContents();

    console.log(dom.children);

    [...dom.children].forEach((e) => {
      console.log(e.textContent);
    });
    console.dir(selection.anchorNode);
    console.dir(selection.anchorNode.nextSibling);
    let sibiling = selection.anchorNode.nextSibling;
    console.log(sibiling);
    console.log(
      selection.anchorOffset,
      selection.focusOffset - 1,
      selection.anchorNode.textContent,
      selection.focusNode.textContent
    );

    let {
      articleStart,
      articleEnd,
      articleStartTail,
      articleEndHead,
    } = findIndexInArticle(
      renderArticle,
      selection.anchorOffset,
      selection.anchorNode.textContent,
      selection.focusOffset,
      selection.focusNode.textContent
    );
    console.log(articleStart);
    console.log(articleEnd);

    if (articleStart !== articleEnd) {
      if (
        selection.anchorNode.textContent === selection.focusNode.textContent
      ) {
        console.log("same node");
        console.log(renderArticle.substr(0, articleStart));
        console.log(
          renderArticle.substr(articleStart, articleEnd - articleStart)
        );
        console.log(renderArticle.substr(articleEnd, renderArticle.length));
        let tempArticle =
          renderArticle.substr(0, articleStart) +
          "<span class=highLighter >" +
          renderArticle.substr(articleStart, articleEnd - articleStart) +
          "</span>" +
          renderArticle.substr(articleEnd, renderArticle.length);
        console.log(tempArticle);
        setRenderArticle(tempArticle);
      } else {
        console.log("cross node");
        console.log(renderArticle.substr(0, articleStart));

        let tempArticle =
          renderArticle.substr(0, articleStart) +
          "<span class=highLighter >" +
          renderArticle.substr(articleStart, articleStartTail - articleStart) +
          "</span>" +
          renderArticle.substr(
            articleStartTail,
            articleEndHead - articleStartTail
          ) +
          "<span class=highLighter >" +
          renderArticle.substr(articleEndHead, articleEnd - articleEndHead) +
          "</span>" +
          renderArticle.substr(articleEnd, renderArticle.length);
        console.log(tempArticle);
        setRenderArticle(tempArticle);
      }
    }

    // console.log(article.readerHtml);
  }

  function storeHighLighter(start, end, uid) {
    db.collection("test")
      .doc("zGPvAjHYjMqFTHBuAzTX")
      .collection("highlight")
      .add({ start: 2, end: 5, uid: "ua112" })
      .then((docRef) => {
        docRef.update({ id: docRef.id });
      });
  }
  const quillRef = React.useRef();

  var selection = window.getSelection();
  useEffect(() => {
    let articleMain = document.querySelector("." + styles.articleMain);

    articleMain.addEventListener("mouseup", handleMouseUp);
    return () => {
      articleMain.removeEventListener("mouseup", handleMouseUp);
    };
  }, [renderArticle]);

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
          dangerouslySetInnerHTML={{ __html: renderArticle }}
        ></div>
        <div className={styles.note}>
          <div>Your Summary</div>

          <ReactQuill
            className={styles.quill1}
            onChangeSelection={(a, b, c) => {}}
            theme="snow"
            ref={(el) => {
              quillRef.current = el;
            }}
            value={note}
            onChange={(e, a, source) => {
              console.log(source);
              console.log(e);
              console.log(note);
              if (source === "user") {
                uploadNote(e);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
