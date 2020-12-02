import * as d3 from "d3";
import { data } from "../data.js";
import { useD3 } from "../hooks/useD3.js";

import styles from "../css/Graph.module.css";
export default function Graph() {
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
      const height = 1000;
      const width = 1000;
      const links = data.links.map((d) => Object.create(d));
      const nodes = data.nodes.map((d) => Object.create(d));

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3.forceLink(links).id((d) => d.id)
        )
        .force("charge", d3.forceManyBody().strength(-200).distanceMax([1000]))
        .force("center", d3.forceCenter(width / 2, height / 2));

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
        .attr("fill", color);
      const text = node
        .append("text")
        .text((d) => d.id)
        .clone(true)
        .lower()
        .attr("stroke-width", 0.05)
        .attr("stroke", "white")
        .attr("fill", "white")
        .attr("tagId", (d) => d.uid)
        .on("click", (a) => {
          console.log(a.target);
        });

      node.append("title").text((d) => d.id);

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        circle.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        text.attr("x", (d) => d.x).attr("y", (d) => d.y);
      });

      return svg.node();
    },
    [data.length]
  );

  return (
    <div className={styles.graphWrapper}>
      <svg
        ref={ref}
        style={{
          height: 1000,
          width: "70%",
          marginRight: "0px",
          marginLeft: "0px",
        }}
      >
        <g className="plot-area" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}
