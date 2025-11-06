import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

interface Unit {
  id: number;
  name: string;
  type: string;
  parent_unit_id: number | null;
  branch_id: number;
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

    // Virtueller Root-Knoten
    const virtualRoot: Unit = { 
      id: 0, 
      name: "JSDF", 
      type: "Root", 
      parent_unit_id: null, 
      branch_id: 0 
    };

    // Units mit Root verbinden (nur Top-Level Units)
    const unitsWithRoot = units.map(u => ({
      ...u,
      parent_unit_id: u.parent_unit_id === null ? 0 : u.parent_unit_id
    }));

    const allUnits = [virtualRoot, ...unitsWithRoot];

    // Hierarchie erstellen
    const root = d3
      .stratify<Unit>()
      .id(d => d.id.toString())
      .parentId(d => d.parent_unit_id !== null ? d.parent_unit_id.toString() : null)
      (allUnits);

    const width = 1600;
    const height = 1200;

    const treeLayout = d3.tree<Unit>().size([height - 200, width - 400]);
    const treeData = treeLayout(root);

    // Alte SVG entfernen
    d3.select(chartRef.current).selectAll("*").remove();

    // Neue SVG erstellen
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const svgGroup = svg.append("g").attr("transform", "translate(200,100)");

    // Zoom-Funktion hinzufügen
    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on("zoom", (event) => {
          svgGroup.attr("transform", event.transform);
        })
    );

    // Verbindungslinien zeichnen
    svgGroup.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x))
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-width", 1.5);

    // Knoten erstellen
    const node = svgGroup.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    // Kreise für Knoten
    node.append("circle")
      .attr("r", d => d.data.id === 0 ? 14 : (d.children ? 10 : 7))
      .attr("fill", d => {
        switch(d.data.branch_id) {
          case 1: return "#2E8B57";    // Ground – Grün
          case 2: return "#1E90FF";    // Maritime – Blau
          case 3: return "#FF8C00";    // Air – Orange
          default: return "#333";      // Root
        }
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    // Textlabels
    node.append("text")
      .attr("dy", 4)
      .attr("x", d => d.children ? -15 : 15)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .style("fill", "#333")
      .text(d => d.data.name);

    // Tooltips
    node.append("title")
      .text(d => `${d.data.name} (${d.data.type})`);

  }, [units]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>
        Japan Self-Defense Forces – Organigramm
      </h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
        Scrollen & Zoomen möglich
      </p>
      <div ref={chartRef} />
    </div>
  );
}