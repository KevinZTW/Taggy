import { useLocation } from "react-router-dom";
import BorderColorOutlinedIcon from "@material-ui/icons/BorderColorOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase.js";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { withStyles } from "@material-ui/core/styles";
import styles from "../../css/Article.module.css";
import { app } from "../../lib/lib.js";
import ReactQuill from "react-quill";
import CreatableSelect from "react-select/creatable";
import { useSelector } from "react-redux";
import ChromeReaderModeOutlinedIcon from "@material-ui/icons/ChromeReaderModeOutlined";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import firebase from "firebase/app";
import "react-quill/dist/quill.snow.css";
export default function Article() {
  console.log("rerender");
  const [showNote, setShowNote] = useState(false);
  const [highLightOn, setHighLightOn] = useState(false);

  const lightOn = useRef(highLightOn);
  const [articleLoaded, setArticleLoaded] = useState(false);
  const [highLights, setHighLights] = useState([]);
  const [tags, setTags] = useState({});
  const [note, setNote] = useState("");
  const [article, setArticle] = useState({});

  const [renderArticle, setRenderArticle] = useState(article.readerHtml);
  const location = useLocation();
  const search = location.search;
  const params = new URLSearchParams(search);
  const id = params.get("id");
  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  const CustomTooltip = withStyles((theme) => ({
    tooltip: {
      color: "white",
      fontFamily: "Open Sans",
      fontSize: 14,
    },
  }))(Tooltip);
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
      backgroundColor: "#000F24",
      minWidth: "300px",
    }),
  };
  useEffect(() => {
    if (user) {
      app.initArticleTags(id, user.uid).then((articleTagSelection) => {
        console.log(articleTagSelection);
        setTags(articleTagSelection);
      });
    }
  }, [id, user]);
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
    console.warn("highLight Init");
    if (articleLoaded && article.highLight) {
      initAricleHighLight(article.highLight);
    }
  }, [articleLoaded]);
  useEffect(() => {
    let unsubscribeNote;
    function getArticles() {
      db.collection("Articles")
        .doc(id)
        .get()
        .then(function (doc) {
          console.log("hihi");
          console.log(doc.data());
          if (doc.data() !== undefined) {
            setArticle({
              title: doc.data().title,
              link: doc.data().link,
              highLight: doc.data().highLight,
              readerHtml: doc.data().readerHtml,
            });
            setRenderArticle(doc.data().readerHtml);
            setArticleLoaded(true);
          }
        });
    }
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
    const encodedStart = startTextContent.replace("&", "&amp;");
    const encodedEnd = endTextContent.replace("&", "&amp;");
    const articleStart = articleString.indexOf(encodedStart) + startIndex;
    const articleStartTail =
      articleString.indexOf(encodedStart) + encodedStart.length;
    const articleEnd = articleString.indexOf(encodedEnd) + endIndex;
    const articleEndHead = articleString.indexOf(encodedEnd);
    return {
      articleStart: articleStart,
      articleStartTail: articleStartTail,
      articleEnd: articleEnd,
      articleEndHead: articleEndHead,
    };
  }

  function saveHighLightToDB(
    textSummary,
    textSlice,
    highLightId,
    uid,
    articleId
  ) {
    db.collection("Articles")
      .doc(articleId)
      .update({
        highLight: firebase.firestore.FieldValue.arrayUnion({
          id: highLightId,
          textSlice: textSlice,
          uid: uid,
          text: textSummary,
        }),
      });
  }
  function findTextAddSpan(targetText, hightLightId, tempRenderArticle) {
    console.warn(targetText);
    var encodedText = targetText.replace("&", "&amp;");
    const indexStart = tempRenderArticle.indexOf(encodedText);
    console.log(indexStart);
    const indexEnd = indexStart + targetText.length;
    if (indexStart !== -1 && indexStart !== 0) {
      const temp =
        tempRenderArticle.substr(0, indexStart) +
        `<span class=highLighter data-id="${hightLightId}">` +
        tempRenderArticle.substr(indexStart, targetText.length) +
        `</span><input z="${hightLightId}">` +
        tempRenderArticle.substr(indexEnd, article.readerHtml.length);

      tempRenderArticle = temp;
    }
    return tempRenderArticle;
  }
  function initAricleHighLight(highLight) {
    let tempRenderArticle = article.readerHtml;
    highLight.forEach((item) => {
      item.textSlice.forEach((textSlice) => {
        tempRenderArticle = findTextAddSpan(
          textSlice,
          item.id,
          tempRenderArticle
        );
      });
    });
    console.error(renderArticle.search("<span class=highLighter"));

    setHighLights(highLight);
    setRenderArticle(tempRenderArticle);
  }

  function handleMouseUp() {
    console.log(lightOn.current);
    if (lightOn.current) {
      var selection = window.getSelection();
      let tempRenderArticle = renderArticle;
      const dom = selection.getRangeAt(0).cloneContents();
      const allTextSlice = [];
      const textSummary = dom.textContent;
      console.log(dom);
      console.log(dom.textContent);
      console.log(dom.children);
      console.log([...dom.children]);

      [...dom.children].forEach((child) => {
        console.log(child.children);
        console.log(child.textContent);
      });

      // console.dir(selection.anchorNode);
      // console.dir(selection.anchorNode.nextSibling);
      // const sibiling = selection.anchorNode.nextSibling;
      // console.log(sibiling);
      // console.log(
      //   selection.anchorOffset,
      //   selection.focusOffset - 1,
      //   selection.anchorNode.textContent,
      //   selection.focusNode.textContent
      // );

      const { articleStart, articleEnd } = findIndexInArticle(
        renderArticle,
        selection.anchorOffset,
        selection.anchorNode.textContent,
        selection.focusOffset,
        selection.focusNode.textContent
      );

      if (articleStart !== articleEnd) {
        if (
          selection.anchorNode.textContent ===
            selection.focusNode.textContent &&
          false
        ) {
          console.log("same node");
          // console.log(renderArticle.substr(0, articleStart));
          // console.log(
          //   renderArticle.substr(articleStart, articleEnd - articleStart)
          // );
          // // console.log(renderArticle.substr(articleEnd, renderArticle.length));
          const tempArticle =
            renderArticle.substr(0, articleStart) +
            "<span class=highLighter >" +
            renderArticle.substr(articleStart, articleEnd - articleStart) +
            "</span>" +
            renderArticle.substr(articleEnd, renderArticle.length);
          // // console.log(tempArticle);
          setRenderArticle(tempArticle);
        } else {
          console.log("cross node==========");
          const highLightId = user.uid + "_" + Date.now().toString();
          highLighting(dom, highLightId);

          function highLighting(dom, highLightId) {
            //整體
            console.log(highLightId);
            if ([...dom.children][0]) {
              //有 child 的情況
              [...dom.children].forEach((child) => {
                highLighting(child, highLightId);
              });
              //child 以外的部分
              const father = dom.textContent;

              const firstChildIndex = father.indexOf(
                [...dom.children][0].textContent
              );
              // father head
              let fatherHead = father.substr(0, firstChildIndex);
              // father tail
              let fatherTail = father.substr(firstChildIndex, father.length);

              [...dom.children].forEach((child) => {
                fatherHead = fatherHead.replace(child.textContent, "");
                fatherTail = fatherTail.replace(child.textContent, "");
              });
              console.error("來處理", fatherHead);
              findTextAddSpan(fatherHead, highLightId);
              console.log(tempRenderArticle.search("<span"));
              console.error("來處理", fatherTail);
              findTextAddSpan(fatherTail, highLightId);
              console.log(tempRenderArticle.search("<span"));
            } else {
              //沒有的情況
              const father = dom.textContent;
              console.error("來處理", father);
              findTextAddSpan(father, highLightId);
              console.log(tempRenderArticle.search("<span"));
            }
          }

          function findTextAddSpan(targetText, hightLightId) {
            console.warn(targetText);
            var encodedText = targetText.replace("&", "&amp;");
            const indexStart = tempRenderArticle.indexOf(encodedText);
            console.log(indexStart);
            const indexEnd = indexStart + targetText.length;
            if (indexStart !== -1 && indexStart !== 0) {
              allTextSlice.push(targetText);
              const temp =
                tempRenderArticle.substr(0, indexStart) +
                `<span class=highLighter data-id="${hightLightId}">` +
                tempRenderArticle.substr(indexStart, targetText.length) +
                `</span><input z="${hightLightId}">` +
                tempRenderArticle.substr(indexEnd, renderArticle.length);

              tempRenderArticle = temp;
            }
          }
          const hightLight = {
            id: highLightId,
            textSlice: allTextSlice,
            uid: user.uid,
            text: textSummary,
          };
          setHighLights([...highLights, hightLight]);
          setRenderArticle(tempRenderArticle);
          saveHighLightToDB(
            textSummary,
            allTextSlice,
            highLightId,
            user.uid,
            id
          );

          // console.log(renderArticle.substr(0, articleStart));
          //=======< old code>==========================
          // let tempArticle =
          //   renderArticle.substr(0, articleStart) +
          //   "<span class=highLighter >" +
          //   renderArticle.substr(articleStart, articleStartTail - articleStart) +
          //   "</span>" +
          //   renderArticle.substr(
          //     articleStartTail,
          //     articleEndHead - articleStartTail
          //   ) +
          //   "<span class=highLighter >" +
          //   renderArticle.substr(articleEndHead, articleEnd - articleEndHead) +
          //   "</span>" +
          //   renderArticle.substr(articleEnd, renderArticle.length);
          // console.log(tempArticle);
          // setRenderArticle(tempArticle);
        }
      }

      // console.log(article.readerHtml);
    }
  }

  const quillRef = React.useRef();

  function renderHightLight(highLights) {
    const highLightBoxes = [];
    highLights.forEach((highLight) => {
      highLightBoxes.push(
        <div className={styles.highLightBox}>
          <div className={styles.highLightText}>{highLight.text}</div>
          <div
            onClick={() => {
              console.log(highLight.id);
              deleteHightLight(highLight.id, id);
            }}
          >
            Delete
          </div>
        </div>
      );
    });
    return highLightBoxes;
  }

  function deleteHightLight(id, articleId) {
    console.log("delete", id);
    //remove article render hightLight
    let tempArticle = renderArticle;
    console.log(tempArticle);

    tempArticle = tempArticle
      .replaceAll(`<span class=highLighter data-id="${id}">`, "")
      .replaceAll(`</span><input z="${id}">`, "");

    //remove highLight state
    const tempHighLight = highLights.filter((item) => {
      return item.id !== id;
    });

    //remove hightLight from db
    db.collection("Articles").doc(articleId).update({
      highLight: tempHighLight,
    });

    setHighLights(tempHighLight);
    setRenderArticle(tempArticle);
  }
  useEffect(() => {
    const articleMain = document.querySelector("." + styles.articleMain);

    articleMain.addEventListener("mouseup", handleMouseUp);
    return () => {
      articleMain.removeEventListener("mouseup", handleMouseUp);
    };
  }, [renderArticle]);
  console.log(highLights);
  const highLightBoxes = renderHightLight(highLights);
  if (renderArticle) {
    console.error(renderArticle.search("<span class=highLighter"));
  }
  return (
    <div className={styles.articleWrapper}>
      <div className={showNote ? styles.mainWithNote : styles.main}>
        <div className={styles.head}>
          <Link to={"/board"}>
            <div className={styles.arrowWrapper}>
              <ArrowBack className={styles.Icon} />
            </div>
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
        <div className={styles.actionIconWrapper}>
          {showNote ? (
            <CustomTooltip title="note tab" arrow>
              <div className={styles.noteOnWrapper}>
                <ChromeReaderModeOutlinedIcon
                  style={{ color: "#FFFCEC" }}
                  onClick={() => {
                    console.log("hihi");
                    setShowNote(false);
                  }}
                />
              </div>
            </CustomTooltip>
          ) : (
            <CustomTooltip title="note tab" arrow>
              <div className={styles.noteOffWrapper}>
                <ChromeReaderModeIcon
                  className={styles.Icon}
                  onClick={() => {
                    console.log("hihi");
                    setShowNote(true);
                  }}
                />
              </div>
            </CustomTooltip>
          )}

          {highLightOn ? (
            <CustomTooltip title="article highlighter" arrow>
              <div className={styles.highLightOnWrapper}>
                <BorderColorOutlinedIcon
                  style={{ color: "#FFFCEC" }}
                  onClick={() => {
                    setHighLightOn(false);
                    lightOn.current = false;
                  }}
                />
              </div>
            </CustomTooltip>
          ) : (
            <CustomTooltip title="article highlighter" arrow>
              <div className={styles.highLightOffWrapper}>
                <BorderColorOutlinedIcon
                  className={styles.Icon}
                  onClick={() => {
                    setHighLightOn(true);
                    lightOn.current = true;
                  }}
                />
              </div>
            </CustomTooltip>
          )}
        </div>
        <div className={styles.articleMain}>
          <div
            className={styles.articleBody}
            dangerouslySetInnerHTML={{ __html: renderArticle }}
          ></div>
        </div>
      </div>
      {showNote ? (
        <div className={styles.noteWrapper}>
          <div className={styles.note}>
            <div className={styles.noteTitle}> Note</div>

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
            <div className={styles.highLightTitle}>Highlights</div>
            {highLightBoxes}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
