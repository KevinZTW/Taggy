import * as d3 from "d3";
import { dataSet } from "../../data.js";
import { dataSet2 } from "../../data2.js";
import { useD3 } from "../../hooks/useD3.js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../../lib/gragh_lib.js";
import { useDispatch } from "react-redux";
import { SWITCHARTICLE } from "../../redux/actions";
import styles from "./Graph.module.css";
export default function Graph() {
  const dispatch = useDispatch();

  const user = useSelector((state) => {
    return state.memberReducer.user;
  });

  const [data, setData] = useState({});
  function color() {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return (d) => scale(d.group);
  }
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  const ref = useD3(
    (svg) => {
      let id;
      const height = 800;
      const width = 1000;
      svg.selectAll("*").remove();
      if (data.nodes) {
        const links = data.links.map((d) => Object.create(d));
        const nodes = data.nodes.map((d) => Object.create(d));

        const simulation = d3
          .forceSimulation(nodes)
          .force(
            "link",
            d3.forceLink(links).id((d) => d.id)
          )
          .force("charge", d3.forceManyBody().strength(-500).distanceMax([500]))
          .force("center", d3.forceCenter(width / 2 - 300, height / 2));

        const link = svg
          .append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .selectAll("line")
          .data(links)
          .join("line")
          .attr("stroke-width", (d) => Math.sqrt(d.value));

        const node = svg
          .append("g")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .selectAll("g")
          .data(nodes)
          .join("g")
          .call(drag(simulation));
        const circle = node
          .append("circle")
          .attr("stroke-width", 1.5)
          .attr("r", 5)
          .attr("fill", "#4F4F4F");
        const text = node
          .append("text")
          .text((d) => d.id)
          .clone(true)
          .lower()
          .attr("stroke-width", 0.2)
          .attr("stroke", "white")
          .attr("fill", "white")
          .attr("id", (d) => d.tagId)
          .on("click", (a) => {
            console.log(a);
            console.log(a.target.id);
            dispatch(SWITCHARTICLE(a.target.id));
          });

        node.append("title").text((d) => d.id);

        simulation.on("tick", () => {
          link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

          circle.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
          text.attr("x", (d) => d.x + 10).attr("y", (d) => d.y);
        });
      }

      return svg.node();
    },
    [data]
  );
  const articleList = useSelector((state) => {
    console.log(state);
    return state.articleReducer.articleList;
  });
  function getGraphData(uid) {
    return new Promise(async (resolve) => {
      let memberTags = await app.getMemberTags(uid);

      resolve(memberTags);
    });
  }
  // {
  //   id: "1qeqw",
  //   value: "ee"
  //   label: "ee"
  // }
  function createCombinationList(tags) {
    let combList = [];
    for (let i = 0; i < tags.length - 1; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        combList.push([tags[i], tags[j]]);
      }
    }
    return combList;
  }
  function countCombinationNumber(articleList, combList) {
    console.error(articleList);
    let links = [];
    console.log(combList);
    for (let i = 0; i < combList.length; i++) {
      let combNumber = 0;
      articleList.forEach((article) => {
        if (article.tags) {
          if (
            article.tags.includes(combList[i][0].id) &&
            article.tags.includes(combList[i][1].id)
          ) {
            combNumber += 1;
          }
        }
      });
      links.push({
        source: combList[i][0].label,
        target: combList[i][1].label,
        value: combNumber,
      });
    }
    return links;
  }
  function combInit(tags) {
    let combList = createCombinationList(tags);
    console.warn(articleList);
    return countCombinationNumber(articleList, combList);
  }

  function initGraphData(uid) {
    return new Promise((resolve) => {
      getGraphData(uid)
        .then((memberTags) => {
          let links = combInit(memberTags);
          let nodes = [];
          memberTags.forEach((tag) => {
            nodes.push({
              id: tag.value,
              tagId: tag.id,
            });
          });
          console.log(links);
          return [nodes, links];
        })
        .then(([nodes, links]) => {
          resolve({
            nodes: nodes,
            links: links,
          });
        });
    });
  }
  useEffect(() => {
    if (user && articleList[0]) {
      console.log(articleList);
      // setDataRun(true);
      console.log(user);
      initGraphData(user.uid).then((data) => {
        console.log("lets set dat=============================a");
        console.log(data);
        setData(data);
      });
    }
  }, [user, articleList]);
  return (
    <div className={styles.graphWrapper}>
      <div className={styles.graphContainer}>
        <div className={styles.titleWrapper}>
          {/* <div className={styles.title}>Tags Graph</div> */}
        </div>
        <div className={styles.graph}>
          <svg
            ref={ref}
            style={{
              height: 800,
              width: "100%",
              marginRight: "20px",
              marginLeft: "0px",
            }}
          >
            <g className="plot-area" />
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>
        </div>
      </div>
    </div>
  );
}
