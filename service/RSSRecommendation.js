import nodejieba from "nodejieba";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { query } from "../server/models/mysqlconfig.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
nodejieba.load({
  stopWordDict: __dirname + "/jiebadict/stop_words.utf8",
});
const sql = `SELECT FeedId, FeedContent,FeedTitle FROM Feed `;
query(sql).then((result) => {
  let keyWordObj = {};
  result.forEach(({ FeedTitle, FeedContent }) => {
    const keywords = nodejieba.extract(FeedContent, 10);

    console.log(FeedTitle);
    console.log("rlated words are ", keywords);
  });

  const sortable = Object.entries(keyWordObj)
    .sort(([, a], [, b]) => a - b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  console.log(sortable);
});

function setKeyWords() {
  const arr1 = [
    "組件",
    "application",
    "React",
    "react",
    "render",
    "Promise",
    "frontend",
    "事件",
    "renderer",
    "Javascript",
    "pm",
    "專案",
    "敏捷",
    "programmer",
    "jokes",
    "數據",
    "資料",
    "english",
    "Hooks",
    "hooks",
    "js",
    "javascript",
    "緩存",
    "節點",
    "transform",
    "keyframes",
    "Modular",
    "smarthome",
    "developers",
    "API",
    "deploy",
    "vue",
    "優化",
    "webpack",
    "面試",
    "查詢",
    "principles",
    "產品",
    "業務",
    "Class",
    "常量",
    "java",
    "Native",
    "iOS",
    "selector",
    "系統",
    "求職",
    "binary",
    "SQL",
    "AWS",
    "test",
    "Unit",
    "request",
    "fetch",

    "css",
    "對象",
    "函數",
    "state",
    "設計",
    "線程",
    "代理",
    "瀏覽器",
    "刷題",
    "component",
    "cdn",
    "babel",
    "內存",
    "performance",
    "array",
    "編譯",
    "數據庫",
    "eslint",
    "服務器",
    "成長",
    "規劃",
    "渲染",
  ];

  arr1.forEach((keyword) => {
    const sqlCheck = `SELECT * FROM KeyWord WHERE KeyWordName = '${keyword}' ;`;
    const sqlAdd = `INSERT INTO KeyWord (KeyWordName) VALUES ('${keyword}') `;
    query(sqlCheck).then((result) => {
      if (result[0]) {
        return;
      } else {
        query(sqlAdd).then((result) => {
          console.log(result);
        });
      }
    });
  });
}

async function setFeedsKeyWord() {
  let feedwithtag = 0;
  let totatlfeed = 0;
  const sql = `SELECT FeedId, FeedContent,FeedTitle FROM Feed `;
  query(sql).then(async (result) => {
    const keyWordList = await query(`SELECT * FROM KeyWord;`).then((result) => {
      let keyWordList = {};
      result.forEach((keyword) => {
        keyWordList[keyword.KeyWordName] = keyword.KeyWordId;
      });
      return keyWordList;
    });

    result.forEach(({ FeedId, FeedTitle, FeedContent }) => {
      totatlfeed += 1;
      const feedKeyWords = nodejieba.extract(FeedContent, 10);
      feedKeyWords.forEach((feedKeyWord) => {
        const word = feedKeyWord.word;
        const keyWordId = keyWordList[word];
        const weight = feedKeyWord.weight;
        if (keyWordList[word]) {
          feedwithtag += 1;
          query(
            `SELECT * FROM FeedKeyWords WHERE FeedId ='${FeedId}' AND KeyWordId='${keyWordId}' `
          ).then((result) => {
            if (result[0]) {
              console.log("already exist");
              return;
            } else {
              console.log("write on table");
              query(
                `INSERT INTO FeedKeyWords (FeedId, KeyWordId, Weight) VALUE ('${FeedId}','${keyWordId}','${weight}') `
              );
            }
          });

          console.log(FeedTitle);
          console.log("exist", word, weight);
        }
      });
    });
    console.log("feed with tags number :", feedwithtag);
    console.log("feed with tag ratio", feedwithtag / totatlfeed);
  });
}
setKeyWords();
setFeedsKeyWord();
