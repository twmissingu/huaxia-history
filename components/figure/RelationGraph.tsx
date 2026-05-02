"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { cn, getDynastyColor } from "@/lib/utils";
import type { HistoricalFigure, Relation } from "@/types/index";
import { X, User } from "lucide-react";

interface RelationGraphProps {
  figure: HistoricalFigure;
  relatedFigures: HistoricalFigure[];
}

const relationTypeLabels: Record<string, string> = {
  friend: "友人",
  enemy: "对手",
  family: "亲属",
  teacher: "师长",
  student: "门生",
  colleague: "同僚",
};

const relationTypeColors: Record<string, string> = {
  friend: "#228b22",
  enemy: "#c9372c",
  family: "#cd853f",
  teacher: "#4169e1",
  student: "#8b008b",
  colleague: "#808080",
};

export function RelationGraph({ figure, relatedFigures }: RelationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: "" });

  useEffect(() => {
    if (!svgRef.current || relatedFigures.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = Math.min(500, width * 0.6);

    svg.attr("width", width).attr("height", height);

    const centerColor = getDynastyColor(figure.dynasty);

    // Build nodes
    const nodes: {
      id: string;
      name: string;
      dynasty: string;
      r: number;
      fx?: number;
      fy?: number;
      isCenter: boolean;
    }[] = [
      {
        id: figure.id,
        name: figure.name,
        dynasty: figure.dynasty,
        r: 45,
        fx: width / 2,
        fy: height / 2,
        isCenter: true,
      },
      ...relatedFigures.map((f) => ({
        id: f.id,
        name: f.name,
        dynasty: f.dynasty,
        r: 28,
        isCenter: false,
      })),
    ];

    // Build links
    const links: {
      source: string;
      target: string;
      type: string;
      description: string;
    }[] = [];

    figure.relations.forEach((rel) => {
      const related = relatedFigures.find((f) => f.id === rel.figureId);
      if (related) {
        links.push({
          source: figure.id,
          target: rel.figureId,
          type: rel.type,
          description: rel.description,
        });
      }
    });

    // Simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links as any)
          .id((d: any) => d.id)
          .distance(140)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.r + 15));

    // Arrow markers
    const defs = svg.append("defs");
    Object.entries(relationTypeColors).forEach(([type, color]) => {
      defs
        .append("marker")
        .attr("id", `arrow-${type}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 30)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", color)
        .attr("opacity", 0.6);
    });

    // Zoom group
    const zoomGroup = svg.append("g").attr("class", "zoom-group");

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform.toString());
      });
    svg.call(zoom as any);

    // Glow filter for center node
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Links
    const linkGroup = zoomGroup.append("g").attr("class", "links");
    const linkElements = linkGroup
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d) => relationTypeColors[d.type] || "#999")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.5)
      .attr("marker-end", (d) => `url(#arrow-${d.type})`)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", 4).attr("stroke-opacity", 0.8);
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY - 40,
          content: `${relationTypeLabels[d.type]}: ${d.description}`,
        });
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 2).attr("stroke-opacity", 0.5);
        setTooltip((t) => ({ ...t, visible: false }));
      });

    // Link labels
    const labelGroup = zoomGroup.append("g").attr("class", "link-labels");
    const labelElements = labelGroup
      .selectAll("text")
      .data(links)
      .enter()
      .append("text")
      .text((d) => relationTypeLabels[d.type] || d.type)
      .attr("font-size", "10px")
      .attr("fill", (d) => relationTypeColors[d.type] || "#999")
      .attr("text-anchor", "middle")
      .attr("dy", -5)
      .style("pointer-events", "none")
      .style("font-family", "'Noto Serif SC', serif");

    // Nodes
    const nodeGroup = zoomGroup.append("g").attr("class", "nodes");
    const nodeElements = nodeGroup
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .style("cursor", (d) => (d.isCenter ? "default" : "pointer"))
      .call(
        d3
          .drag<any, any>()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            if (!d.isCenter) {
              d.fx = null;
              d.fy = null;
            }
          })
      )
      .on("click", (event, d: any) => {
        if (!d.isCenter) {
          router.push(`/figure/${d.id}/`);
        }
      });

    // Node circles
    nodeElements
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) =>
        d.isCenter ? centerColor : getDynastyColor(d.dynasty)
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", (d) => (d.isCenter ? 4 : 2))
      .attr("filter", (d) => (d.isCenter ? "url(#glow)" : null))
      .attr("opacity", 0.9);

    // Node inner circle (white ring for center)
    nodeElements
      .filter((d: any) => d.isCenter)
      .append("circle")
      .attr("r", (d: any) => d.r - 6)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", 1);

    // Node text
    nodeElements
      .append("text")
      .text((d: any) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", (d: any) => d.r + 16)
      .attr("fill", "#3d2b1f")
      .attr("font-size", (d: any) => (d.isCenter ? "14px" : "12px"))
      .attr("font-weight", (d: any) => (d.isCenter ? "700" : "500"))
      .style("pointer-events", "none")
      .style("font-family", "'Noto Serif SC', serif");

    // Dynasty label below name
    nodeElements
      .append("text")
      .text((d: any) =>
        d.isCenter ? "" : getDynastyColor(d.dynasty) ? d.dynasty : ""
      )
      .attr("text-anchor", "middle")
      .attr("dy", (d: any) => d.r + 30)
      .attr("fill", "#9a8b7e")
      .attr("font-size", "10px")
      .style("pointer-events", "none");

    // Update positions on tick
    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      labelElements
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      nodeElements.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
      svg.on('.zoom', null);
    };
  }, [figure, relatedFigures, router]);

  if (relatedFigures.length === 0) {
    return (
      <div className="text-center py-12 text-ink-light">
        <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">暂无相关人物记载</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative overflow-hidden rounded-2xl border border-ink-lighter/10 bg-white dark:bg-paper-dark touch-pan-y">
        <svg
          ref={svgRef}
          className="w-full"
          style={{ minHeight: 300 }}
        />
        {/* Mobile zoom hint */}
        <div className="md:hidden absolute bottom-2 right-2 px-2 py-1 rounded bg-ink-black/60 text-white text-[10px] pointer-events-none">
          双指缩放 · 拖动
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {Object.entries(relationTypeLabels).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: relationTypeColors[type] }}
            />
            <span className="text-xs text-ink-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-3 py-2 rounded-lg bg-ink-black text-white text-xs max-w-xs pointer-events-none shadow-xl transition-opacity duration-150"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
