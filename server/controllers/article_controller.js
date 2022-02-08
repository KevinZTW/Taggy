import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
var turndownService = new TurndownService();
import { JSDOM } from "jsdom";
import * as fs from "fs";
import axios from "axios";
import { addArticle } from "../models/article_model.js";
import { resolve } from "path";


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
      
      addArticle(uid, title, readerHtml, markdown, url);

    })
    .catch((error) => {
      console.log(error);
    });
};


export { getArticle };
