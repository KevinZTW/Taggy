import Card from "./Card";
import "../css/CardWrapper.css";
import { useSelector } from "react-redux";
export default function CardWrapper(props) {
  const tagSelected = useSelector((state) => {
    return state.articleReducer.tagSelected;
  });
  const list = useSelector((state) => {
    let list = [];
    let articleList = state.articleReducer.articleList;
    if (state.articleReducer.tagSelected === "all") {
      for (let i in articleList) {
        console.log(articleList);
        list.push(
          <Card
            title={articleList[i].title}
            content={articleList[i].content}
            id={articleList[i].id}
            key={articleList[i].id}
          />
        );
      }
    } else if (state.articleReducer.tagSelected) {
      for (let i in articleList) {
        console.log(articleList);
        if (
          articleList[i].tags &&
          articleList[i].tags.includes(state.articleReducer.tagSelected)
        ) {
          list.push(
            <Card
              title={articleList[i].title}
              content={articleList[i].content}
              id={articleList[i].id}
              key={articleList[i].id}
            />
          );
        }
      }
    }
    return list;
  });

  return <div className="cardWrapper">{list}</div>;
}
