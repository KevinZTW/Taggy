import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
var turndownService = new TurndownService();
import { JSDOM } from "jsdom";
import * as fs from "fs";
import axios from "axios";
import { addArticle } from "../models/article_model.js";

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
      console.log(article.title);
      let readerHtml = article.content;
      // fs.writeFile(
      //   __dirname + "/../articles/after.html",
      //   article.content,
      //   function (err) {
      //     if (err) {
      //       return console.log(err);
      //     }
      //   }
      // );

      var markDown = turndownService.turndown(readerHtml);
      addArticle(uid, article.title, readerHtml, markDown);
    })
    .catch((error) => {
      console.log(error);
    });
};

export { getArticle };
