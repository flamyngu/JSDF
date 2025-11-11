import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

interface Unit {
  id: number;
  name: string;
  type: string;
  parent_unit_id: number | null;
  branch_id: number;
  children?: Unit[];
  _children?: Unit[];
}

export default function App() {
  const [units, setUnits] = useState<Unit[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:4000/units")
      .then(res => res.json())
      .then((data: Unit[]) => setUnits(data))
      .catch(err => console.error("Fehler beim Laden der Daten:", err));
  }, []);

  useEffect(() => {
    if (!chartRef.current || units.length === 0) return;

    const virtualRoot: Unit = {
      id: 0,
      name: "JSDF",
      type: "Root",
      parent_unit_id: null,
      branch_id: 0
    };

    const unitsWithRoot = units.map(u => ({
      ...u,
      parent_unit_id: u.parent_unit_id === null ? 0 : u.parent_unit_id
    }));

    const allUnits = [virtualRoot, ...unitsWithRoot];

    const root = d3
      .stratify<Unit>()
      .id(d => d.id.toString())
      .parentId(d => (d.parent_unit_id !== null ? d.parent_unit_id.toString() : null))(allUnits);

    const treeLayout = d3.tree<Unit>().nodeSize([80, 300]);

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", 4000)
      .attr("height", 4000);

    const svgGroup = svg.append("g").attr("transform", "translate(200,100)");

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on("zoom", (event) => {
          svgGroup.attr("transform", event.transform);
        })
    );

    let i = 0;
    const duration = 750;

    function update(source: any) {
      const treeData = treeLayout(root);
      const nodes = treeData.descendants();
      const links = treeData.links();

      const node = svgGroup.selectAll("g.node")
        .data(nodes, (d: any) => d.id || (d.id = ++i));

      const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", `translate(${source.y0},${source.x0})`)
        .on("click", (event, d) => {
          toggle(d);
          update(d);
        });

      nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", (d: any) => d._children ? "lightsteelblue" : "#fff");

      // Add text first to measure it
      const textElement = nodeEnter.append("text")
        .attr("dy", ".35em")
        .attr("x", (d: any) => d.children || d._children ? -13 : 13)
        .attr("text-anchor", (d: any) => d.children || d._children ? "end" : "start")
        .text((d: any) => d.data.name)
        .style("fill", "#333")
        .style("font", "14px sans-serif")
        .style("font-weight", "500")
        .style("pointer-events", "none");

      // Add background rect for each text
      nodeEnter.insert("rect", "text")
        .attr("class", "text-bg")
        .attr("x", function(this: any, d: any) {
          const textNode = d3.select(this.parentNode).select("text").node() as SVGTextElement;
          if (!textNode) return 0;
          const bbox = textNode.getBBox();
          return d.children || d._children ? bbox.x - 5 : bbox.x - 5;
        })
        .attr("y", function(this: any) {
          const textNode = d3.select(this.parentNode).select("text").node() as SVGTextElement;
          if (!textNode) return 0;
          const bbox = textNode.getBBox();
          return bbox.y - 2;
        })
        .attr("width", function(this: any) {
          const textNode = d3.select(this.parentNode).select("text").node() as SVGTextElement;
          if (!textNode) return 0;
          const bbox = textNode.getBBox();
          return bbox.width + 10;
        })
        .attr("height", function(this: any) {
          const textNode = d3.select(this.parentNode).select("text").node() as SVGTextElement;
          if (!textNode) return 0;
          const bbox = textNode.getBBox();
          return bbox.height + 4;
        })
        .style("fill", "white")
        .style("stroke", "#999")
        .style("stroke-width", "1px")
        .style("rx", "5")
        .style("ry", "5")
        .style("opacity", 0.95);

      const nodeUpdate = nodeEnter.merge(node as any);

      nodeUpdate.transition()
        .duration(duration)
        .attr("transform", (d: any) => `translate(${d.y},${d.x})`);

      nodeUpdate.select("circle")
        .attr("r", 10)
        .style("fill", (d: any) => {
            switch(d.data.branch_id) {
              case 1: return "#2E8B57";
              case 2: return "#1E90FF";
              case 3: return "#FF8C00";
              default: return d._children ? "lightsteelblue" : "#333";
            }
        })
        .attr("cursor", "pointer");

      const nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", `translate(${source.y},${source.x})`)
        .remove();

      nodeExit.select("circle").attr("r", 1e-6);
      nodeExit.select("text").style("fill-opacity", 1e-6);
      nodeExit.select(".text-bg").style("opacity", 1e-6);

      const linkGenerator = d3.linkHorizontal<any, any>().x(d => d.y).y(d => d.x);

      const link = svgGroup.selectAll("path.link")
        .data(links, (d: any) => d.target.id);

      const linkEnter = link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", (d: any) => {
          const o = { x: source.x0, y: source.y0 };
          return linkGenerator({ source: o, target: o } as any);
        });

      const linkUpdate = linkEnter.merge(link as any);

      linkUpdate.transition()
        .duration(duration)
        .attr("d", linkGenerator as any);

      link.exit().transition()
        .duration(duration)
        .attr("d", (d: any) => {
          const o = { x: source.x, y: source.y };
          return linkGenerator({ source: o, target: o } as any);
        })
        .remove();

      nodes.forEach((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    function toggle(d: any) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    }

    root.x0 = 2000;
    root.y0 = 0;

    root.descendants().forEach((d: any, i) => {
      d.id = i;
      d.x0 = d.x;
      d.y0 = d.y;
    });

    update(root);

  }, [units]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1 className="chart-title">
        Japan Self-Defense Forces – Organigramm
      </h1>
      <p className="chart-subtitle">
        Scrollen & Zoomen möglich. Klicken zum Auf- und Zuklappen.
      </p>
      <div className="chart-container">
        <div ref={chartRef} />
      </div>
    </div>
  );
}