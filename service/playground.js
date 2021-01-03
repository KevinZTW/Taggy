import nodejieba from "nodejieba";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

nodejieba.load({
  stopWordDict: __dirname + "/jiebadict/stop_words.utf8",
  userDict: __dirname + "/jiebadict/userdict.utf8",
  idfDict: __dirname + "/jiebadict/idf.utf8",
});
var sentence = "後端工程師老是不會前端框架雲平面設計的人會區塊鏈";

const result = nodejieba.extract(sentence.toLowerCase(), 100);
console.log(result);
