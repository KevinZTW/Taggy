
use TAGGY;
select * from User;
select * from UserSubscription where UserUID = 'Y8WsSi5lonXgSlE7DbmnMiEpbwJ3';
SELECT * FROM User WHERE UserUID = "wIw37MBgbSWUy8kuPrrkddpiM6M2";
select * from KeyWord;
select * from KeyWord limit 10;
select * from FeedKeyWords limit 500;
select * from RSS where RSSId ="oT0mRYnYSGnqrWPq3I1C";
select * from FeedKeyWords 
    JOIN KeyWord on FeedKeyWords.KeyWordId = KeyWord.KeyWordId
    JOIN Feed on Feed.FeedId = FeedKeyWords.FeedId
    where Feed.FeedId ="wYNumw86RFBOtlUH9uaz";
select * from Feed where FeedId = "wYNumw86RFBOtlUH9uaz";
select * from Feed where RSSId = "NOulYNIAsYlMHRLTsoRf" ;
select * from FeedKeyWords 
	JOIN KeyWord on FeedKeyWords.KeyWordId = KeyWord.KeyWordId
    JOIN Feed on Feed.FeedId = FeedKeyWords.FeedId
    where Feed.FeedId ='wYNumw86RFBOtlUH9uaz';
    
select Feed.FeedId AS FeedId, Feed.FeedTitle AS title, RSS.RSSName AS RSS,Feed.FeedPubDate AS pubDate, Feed.FeedContentSnippet AS contentSnippet,Feed.FeedContent AS content, Feed.FeedLink AS link, KeyWord.KeyWordName
	from Feed 
    JOIN FeedKeyWords on FeedKeyWords.FeedId = Feed.FeedId
    JOIN KeyWord on FeedKeyWords.KeyWordId = KeyWord.KeyWordId
    join RSS on Feed.RSSId = RSS.RSSId
		where KeyWord.KeyWordId  IN ('30',"13","4") 
            order by Feed.FeedPubDate desc
        limit 5;
        
        
        
    
    
    
ALTER TABLE FeedKeyWords ADD Weight FLOAT;
select * from Feed limit 100;
select * from User;
SELECT * FROM Feed;
select User.UserUID from User;
SELECT * FROM UserSubscription;
select * from UserSubscription;
select Feed.FeedId AS FeedId, Feed.FeedTitle AS title, RSS.RSSName AS RSS,Feed.FeedPubDate AS pubDate, Feed.FeedContentSnippet AS contentSnippet,Feed.FeedContent AS content, Feed.FeedLink AS link, KeyWord.KeyWordName
 from Feed 
 join UserSubscription 
	on Feed.RSSId = UserSubscription.RSSId 
join RSS 
	on Feed.RSSId = RSS.RSSId
join FeedKeyWords
	on FeedKeyWords.FeedId =Feed.FeedId
join KeyWord 
	on KeyWord.KeyWordId = FeedKeyWords.KeyWordId
where UserSubscription.UserUID = 'U8fx6rNCYSVxz38gdseSG2KEHfJ2'
order by Feed.FeedPubDate desc;


select * from Feed where RSSId in ('fXce3sR0lgvHiBn2KZYN','K7eGFfzcCrXErhBPsKM0','fzKiwTaqX94LqJLuH3bx','NOulYNIAsYlMHRLTsoRf');
-- alter table Feed add FULLTEXT Index_FeedTitle(FeedTitle)  WITH PARSER ngram;

-- alter table Feed drop index Index_FeedTitle;

SELECT * FROM Feed WHERE MATCH (FeedTitle, FeedContent) AGAINST ('' IN NATURAL LANGUAGE MODE);
SELECT * FROM Feed 
  WHERE MATCH (FeedTitle)
        AGAINST ('' IN NATURAL LANGUAGE MODE);
        
SELECT * FROM KeyWord;
INSERT INTO KeyWord (KeyWordName) VALUES (";

-- INSERT INTO RSS (RSSId, RSSName, RSSDescription, RSSUrl,RSSLASTUPDATE ,RSSImg) VALUES(

-- "0t9ZgEGhF9Rqjeb3yBFs",
-- "Frontend Digest - Medium",
-- "Anything and everything frontend. JavaScript, CSS and HTML. - Medium",
-- "https://medium.com/feed/frontend-digest",
-- 1231232,
-- "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png"

-- );