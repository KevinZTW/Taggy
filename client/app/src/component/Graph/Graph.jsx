import * as d3 from "d3";
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
            d3.select(this).style("stroke", "yellow");
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
    return state.articleReducer.articleList;
  });
  function getGraphData(uid) {
    return new Promise(async (resolve) => {
      const memberTags = await app.getMemberTags(uid);

      resolve(memberTags);
    });
  }
  function createCombinationList(tags) {
    const combList = [];
    for (let i = 0; i < tags.length - 1; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        combList.push([tags[i], tags[j]]);
      }
    }
    return combList;
  }
  function countCombinationNumber(articleList, combList) {
    const links = [];
    for (let i = 0; i < combList.length; i++) {
      let combNumber = 0;
      articleList.forEach((article) => {
        console.log(article);
        if (article.tags) {
          console.log(article.tags);
          console.log(combList[i][1]);
          if (
            article.tags.includes(combList[i][0].tagId) &&
            article.tags.includes(combList[i][1].tagId)
          ) {
            combNumber += 1;
          }
        }
      });
      console.log(combNumber);
      links.push({
        source: combList[i][0].label,
        target: combList[i][1].label,
        value: combNumber,
      });
    }
    return links;
  }
  function combInit(tags) {
    const combList = createCombinationList(tags);
    return countCombinationNumber(articleList, combList);
  }

  function initGraphData(uid) {
    return new Promise((resolve) => {
      getGraphData(uid)
        .then((memberTags) => {
          const links = combInit(memberTags);
          const nodes = [];
          memberTags.forEach((tag) => {
            nodes.push({
              id: tag.value,
              tagId: tag.id,
            });
          });
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
      initGraphData(user.uid).then((data) => {
        setData(data);
      });
    }
  }, [user, articleList]);
  return (
    <div className={styles.graphWrapper}>
      <div className={styles.graphContainer}>
        <div className={styles.titleWrapper}></div>
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
