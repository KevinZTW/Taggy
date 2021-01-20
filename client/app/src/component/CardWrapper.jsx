import Card from "./Card";
import "../css/CardWrapper.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { db } from "../firebase";
export default function CardWrapper() {
  const tagSelected = useSelector((state) => {
    return state.articleReducer.tagSelected;
  });
  const articleList = useSelector((state) => {
    return state.articleReducer.articleList;
  });
  const list = [];
  const [tagedArticlelist, setTagedArticlelist] = useState([]);

  useEffect(() => {
    function fetchTagedArticles(tagSelected) {
      const tempArticleList = [];
      db.collection("Articles")
        .where("tags", "array-contains", tagSelected)
        .get()
        .then((snapShot) => {
          snapShot.forEach((doc) => {
            tempArticleList.push(doc.data());
          });
          setTagedArticlelist(tempArticleList);
        });
    }
    if (tagSelected) {
      fetchTagedArticles(tagSelected);
    }
  }, [tagSelected]);
  if (tagSelected === "all") {
    for (const i in articleList) {
      list.push(
        <Card
          title={articleList[i].title}
          content={articleList[i].markDown}
          id={articleList[i].id}
          key={articleList[i].id}
          tags={articleList[i].tags}
          link={articleList[i].link}
          htmlContent={articleList[i].readerHtml}
        />
      );
    }
  } else if (tagSelected) {
    if (tagedArticlelist[0] === undefined) {
      list.push(<div>You dont have article on this tag yet!</div>);
    }
    for (const i in tagedArticlelist) {
      list.push(
        <Card
          title={tagedArticlelist[i].title}
          content={tagedArticlelist[i].markDown}
          id={tagedArticlelist[i].id}
          key={tagedArticlelist[i].id}
          link={tagedArticlelist[i].link}
          htmlContent={tagedArticlelist[i].readerHtml}
        />
      );
    }
  }
  return <div className="cardWrapper">{list}</div>;
}
