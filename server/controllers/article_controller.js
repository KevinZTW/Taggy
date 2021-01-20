import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
var turndownService = new TurndownService();
import { JSDOM } from "jsdom";
import * as fs from "fs";
import axios from "axios";
import { addArticle } from "../models/article_model.js";
import OpenCC from "opencc";
import { resolve } from "path";
const converter = new OpenCC("s2t.json");

const getArticle = function (uid, url) {
  axios
    .get(url)
    .then((response) => {
      var doc = new JSDOM(response.data, {
        url: url,
      });
      let docTitle = doc.window.document.head.title.textContent;
      let reader = new Readability(doc.window.document);
      let article = reader.parse();

      let title = article.title;
      let readerHtml = article.content;
      var markdown = turndownService.turndown(readerHtml).slice(0, 200);
      console.log("-------------------------------------");
      console.log("markdown is ", markdown);
      console.log("測試", title, markdown);
      translation(title, readerHtml, markdown).then((converted) => {
        console.log("converted 完成");
        console.log("converted 內容", converted[0], converted[1], converted[2]);
        addArticle(uid, converted[0], converted[1], converted[2], url);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

async function translation(a, b, c) {
  let converteda = await converter.convertPromise(a);
  let convertedb = await converter.convertPromise(b);
  let convertedc = await converter.convertPromise(c);
  return [converteda, convertedb, convertedc];
}

export { getArticle };
