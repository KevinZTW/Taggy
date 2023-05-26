
Create DATABASE taggy_development;
\c taggy_development;

CREATE TABLE IF NOT EXISTS rss_sources
(
 id         SERIAL NOT NULL PRIMARY KEY,
 name        TEXT NOT NULL ,
 description TEXT NULL ,
 url         TEXT NOT NULL ,
 last_update  TIMESTAMPTZ NULL ,
 img_url         TEXT NULL
);


CREATE TABLE IF NOT EXISTS users
(
  uid        TEXT NOT NULL PRIMARY KEY,
  display_name TEXT NULL ,
  email       TEXT NOT NULL
);



CREATE TABLE IF NOT EXISTS rss_feeds
(
 id         SERIAL NOT NULL PRIMARY KEY,
 rss_source_id INTEGER NOT NULL REFERENCES rss_sources(id),
 title          TEXT NOT NULL ,
 content        TEXT NULL ,
 content_snippet TEXT NULL ,
 guid           TEXT NULL ,
 pub_date        TIMESTAMPTZ NULL ,
 url           TEXT NULL
);

CREATE TABLE IF NOT EXISTS user_rss_subscriptions
(
  id  SERIAL NOT NULL PRIMARY KEY,
  user_uid         TEXT REFERENCES users(uid),
  rss_source_id      INTEGER REFERENCES rss_sources(id)
);


CREATE TABLE IF NOT EXISTS key_words
(
  id    SERIAL NOT NULL PRIMARY KEY,
  data TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS categories
(
 id    SERIAL NOT NULL PRIMARY KEY,
 name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS category_key_words
(
  id    SERIAL NOT NULL PRIMARY KEY,
 category_id         INTEGER REFERENCES categories(id),
 key_word_id         INTEGER REFERENCES key_words(id)
);


CREATE TABLE IF NOT EXISTS feed_key_words
(
  id    SERIAL NOT NULL PRIMARY KEY,
 feed_id         INTEGER REFERENCES rss_feeds(id),
 key_word_id         INTEGER REFERENCES key_words(id),
  weight         FLOAT NOT NULL
);


