-- CREATE TABLE IF NOT EXISTS accounts
-- (
--  id         SERIAL NOT NULL PRIMARY KEY,
--  name        TEXT,
--  description TEXT,
--  url         TEXT,
--  last_update  TIMESTAMPTZ NULL,
--  img_url         TEXT NULL
-- );

CREATE TABLE IF NOT EXISTS tests
(
  id    SERIAL NOT NULL PRIMARY KEY,
  data TEXT NOT NULL
);