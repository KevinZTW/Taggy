import Card from "./Card";
import "../css/CardWrapper.css";
import { useSelector } from "react-redux";
import { db } from "../firebase.js";
export default function CardWrapper() {
  const list = useSelector((state) => {
    // function getUserTags(uid) {
    //   let tagListWithName = {};
    //   async function getUserBatchTags(tagList, querystart, querytotal) {
    //     if (querytotal > 0) {
    //       await db
    //         .collection("Tags")
    //         .where("id", "in", tagList.slice(querystart, 10))
    //         .get()
    //         .then((snapShot) => {
    //           snapShot.forEach((doc) => {

    //             tagListWithName[doc.data().id] = doc.data().name;
    //           });
    //           console.warn("================one batch tag edn");
    //         });
    //       getUserBatchTags(tagList, querystart + 10, querytotal - 10);
    //     } else {
    //       return;
    //     }
    //   }

    //   return new Promise((resolve, reject) => {
    //     db.collection("Member")
    //       .doc(uid)
    //       .get()
    //       .then(async (doc) => {

    //         if (doc.data()) {
    //           let tagIds = doc.data().tags;
    //           console.log(tagIds);
    //           if (tagIds !== "" && tagIds) {
    //             await getUserBatchTags(tagIds, 0, tagIds.length);
    //             console.error("batch done");
    //           }
    //         }
    //       });
    //   }).then(console.log(tagListWithName));
    // }
    // if (state.memberReducer.user) {
    //   getUserTags(state.memberReducer.user.uid);
    // }

    const list = [];
    const articleList = state.articleReducer.articleList;

    if (state.articleReducer.tagSelected === "all") {
      for (const i in articleList) {
        list.push(
          <Card
            title={articleList[i].title}
            content={articleList[i].content}
            id={articleList[i].id}
            key={articleList[i].id}
            tags={articleList[i].tags}
            link={articleList[i].link}
            htmlContent={articleList[i].readerHtml}
          />
        );
      }
    } else if (state.articleReducer.tagSelected) {
      for (const i in articleList) {
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
              link={articleList[i].link}
              htmlContent={articleList[i].readerHtml}
            />
          );
        }
      }
    }
    return list;
  });

  return <div className="cardWrapper">{list}</div>;
}
