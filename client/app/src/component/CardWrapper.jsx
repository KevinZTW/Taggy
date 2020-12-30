import Card from "./Card";
import "../css/CardWrapper.css";
import { useSelector } from "react-redux";
export default function CardWrapper() {
  const tagSelected = useSelector((state) => {
    return state.articleReducer.tagSelected;
  });
  console.log(tagSelected);
  const articleList = useSelector((state) => {
    return state.articleReducer.articleList;
  });
  console.log(articleList);
  const list = [];
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
    for (const i in articleList) {
      if (articleList[i].tags && articleList[i].tags.includes(tagSelected)) {
        list.push(
          <Card
            title={articleList[i].title}
            content={articleList[i].content}
            id={articleList[i].id}
            key={articleList[i].id}
            link={articleList[i].link}
            htmlContent={articleList[i].readerHtml}
          />
        );
      }
    }
  }

  return <div className="cardWrapper">{list}</div>;
}
