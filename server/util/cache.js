import RedisCluster from "redis-clustr";
import redis from "redis";
import { promisify } from "util";

const client = new RedisCluster({
  servers: [
    {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  ],
});
client.on("error", function (error) {
  console.error(error);
});
const hgetAsync = promisify(client.hget).bind(client);

const setFeedTagsCache = (feedId, feedTags) => {
  const feedTags_string = JSON.stringify(feedTags);
  client.hset("feedTags", feedId, feedTags_string, function (err, reply) {
    if (err) {
      console.log(err);
    } else {
      console.log(reply);
    }
  });
};

const getFeedTagsCache = (feedId) => {
  return hgetAsync("feedTags", feedId)
    .then((feedTags) => {
      const feedTags_object = JSON.parse(feedTags);
      return feedTags_object;
    })
    .catch(console.error);
};

export const cache = {
  setFeedTagsCache: setFeedTagsCache,
  getFeedTagsCache: getFeedTagsCache,
};
