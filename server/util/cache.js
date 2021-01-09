import RedisCluster from "redis-clustr";
import redis from "redis";
import { promisify } from "util";

// const client = redis.createClient(
//   "6379",
//   "redis-taggy.vrv55k.clustercfg.apne1.cache.amazonaws.com"
// );

const client = new RedisCluster({
  servers: [
    {
      host: "localhost",
      port: 6379,
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
      console.log(reply); // 新增成功會回傳 ok
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

// setFeedTagsCache("111", { kaevin: "werwe", www: "erwer" });

export const cache = {
  setFeedTagsCache: setFeedTagsCache,
  getFeedTagsCache: getFeedTagsCache,
};
