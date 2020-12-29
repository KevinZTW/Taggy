
use TAGGY;

select * from Feed;
-- alter table Feed add FULLTEXT Index_FeedTitle(FeedTitle)  WITH PARSER ngram;

-- alter table Feed drop index Index_FeedTitle;

SELECT * FROM Feed WHERE MATCH (FeedTitle, FeedContent) AGAINST ('代碼分割' IN NATURAL LANGUAGE MODE);
SELECT * FROM Feed 
  WHERE MATCH (FeedTitle)
        AGAINST ('' IN NATURAL LANGUAGE MODE);
-- INSERT INTO RSS (RSSId, RSSName, RSSDescription, RSSUrl,RSSLASTUPDATE ,RSSImg) VALUES(

-- "0t9ZgEGhF9Rqjeb3yBFs",
-- "Frontend Digest - Medium",
-- "Anything and everything frontend. JavaScript, CSS and HTML. - Medium",
-- "https://medium.com/feed/frontend-digest",
-- 1231232,
-- "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"

-- );