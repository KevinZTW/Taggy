import nodejieba from "nodejieba";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { query } from "../server/models/mysqlconfig.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
nodejieba.load({
  userDict: __dirname + "/jiebadict/userdict.utf8",
  stopWordDict: __dirname + "/jiebadict/stop_words.utf8",
  idfDict: __dirname + "/jiebadict/idf.utf8",
});

function testCurrentKeyWord() {
  const sql = `SELECT FeedId, FeedContent,FeedTitle FROM Feed `;
  query(sql).then((result) => {
    let keyWordObj = {};
    result.forEach(({ FeedTitle, FeedContent }) => {
      const keywords = nodejieba.extract(FeedContent.toLowerCase(), 20);

      console.log(FeedTitle);

      console.log("rlated words are ", keywords);
    });

    const sortable = Object.entries(keyWordObj)
      .sort(([, a], [, b]) => a - b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    console.log(sortable);
  });
}

function setKeyWords() {
  let keywordlist = [
    "paradigm",
    "asynchronous",
    "frontend",
    "cdn",
    "promise",
    "react",
    "hooks",
    "react進階",
    "redis",
    "redux",
    "render",
    "renderer",
    "javascript",
    "deploy",
    "modular",
    "api",
    "linux",
    "principle",
    "java",
    "ios",
    "binary",
    "sql",
    "mysql",
    "unit",
    "css",
    "session",
    "eslint",
    "component",
    "context",
    "leetcode",
    "vue",
    "webpack",
    "babel",
    "native",
    "aws",
    "ngnix",
    "array",
    "object",
    "kubernetes",
    "docker",
    "pm",
    "產品經理",
    "異步",
    "正則表達式 ",
    "非同步",
    "迴圈",
    "壓縮",
    "用戶體驗",
    "最佳工程",
    "工程化",
    "敏捷開發",
    "部署",
    "二叉樹",
    "數組",
    "遍歷",
    "刷題",
    "緩存",
    "內存",
    "服務器",
    "可視化",
    "平面設計",
    "生產力工具",
    "金融服務",
    "前端框架",
    "前端技術",
    "前端",
    "前端面試",
    "瀏覽器",
    "優化技術",
    "優化建議",
    "渲染",
    "渲染性能",
    "性能優化",
    "網絡請求",
    "後端工程師",
    "全棧",
    "架構師",
    "模組化",
    "組件",
    "後端",
    "高可用性",
    "數據庫",
    "數據備份",
    "雲計算",
    "雲原生",
    "網絡安全",
    "超時請求",
    "數據結構",
    "資料庫",
    "算法",
    "操作系統",
    "演算法",
    "節點",
    "區塊鏈",
    "技術文章",
    "技術管理",
    "面試題",
    "面試項目",
    "面試資料",
    "代碼規範",
    "個人成長",
    "思維導圖",
    "思考結構",
    "結構化思維",
    "金字塔結構",
  ];
  keywordlist.forEach((keyword) => {
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

export async function setFeedsKeyWord() {
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
// setKeyWords();
// setFeedsKeyWord();
