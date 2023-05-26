import { resolve } from "path";
import { app } from "./lib.js";
app.getGraphData = function (uid) {
  return new Promise(async (resolve) => {
    const memberTags = await app.getMemberTags(uid);

    resolve(memberTags);
  });
};

app.initGraphData = function (uid) {
  return new Promise((resolve) => {
    app
      .getGraphData(uid)
      .then((memberTags) => {
        const nodes = [];
        memberTags.forEach((tag) => {
          nodes.push({
            id: tag.value,
            tagId: tag.id,
          });
        });
        return nodes;
      })
      .then((nodes) => {
        resolve({
          nodes: nodes,
          links: [],
        });
      });
  });
};

export { app };
