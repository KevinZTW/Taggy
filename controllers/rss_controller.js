import Parser from "rss-parser";
let parser = new Parser();

export async function fetchRSS(url) {
  let feed = await parser.parseURL(url);
  console.log(feed.title);
  return feed;
}
