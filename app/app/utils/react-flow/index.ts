import { Node as XYNode, Edge as XYEdge, Position } from "@xyflow/react";
import { Project as PWProject } from "@playwright/test";
import dagre from "@dagrejs/dagre";

/**
 * Builds a React-Flow graph (nodes & edges) from a list of SuiteConfig.
 * @param configs  The subset of SuiteConfig objects to render
 */

export function buildDependencyGraph(configs: PWProject[]): {
  nodes: XYNode[];
  edges: XYEdge[];
} {
  // 1) Core nodes
  const nodes: XYNode[] = configs.map((cfg) => ({
    id: cfg.name!,
    data: { label: cfg.name },
    position: { x: 0, y: 0 }, // will be updated by layout
    style:
      cfg.metadata?.type === "suite"
        ? { border: "2px solid var(--color-primary)", padding: 10 }
        : cfg.metadata?.type === "setup"
          ? { border: "2px solid var(--color-secondary)", padding: 10 }
          : { border: "2px solid var(--color-accent)", padding: 10 },
  }));

  // 2) Core edges
  const edges: XYEdge[] = [];
  for (const cfg of configs) {
    for (const dep of cfg.dependencies ?? []) {
      if (configs.some((c) => c.name === dep)) {
        edges.push({
          id: `e-${dep}-${cfg.name}`,
          source: dep,
          target: cfg.name!,
          animated: cfg.metadata?.type === "setup",
        });
      }
    }
  }

  // 3) Determine roots (nodes with no incoming edges)
  const dependentSet = new Set(edges.map((e) => e.target));
  const roots = nodes.filter((n) => !dependentSet.has(n.id));

  // 4) Determine leaves (nodes with no outgoing edges)
  const sourceSet = new Set(edges.map((e) => e.source));
  const leaves = nodes.filter((n) => !sourceSet.has(n.id));

  // 5) Add anchor 'start' node
  nodes.push({
    id: "start",
    data: { label: "Start" },
    position: { x: 0, y: 0 },
    style: {
      border: "2px dashed #2563eb",
      padding: 10,
      background: "#eff6ff",
    },
  });
  // Edges from start -> each root
  roots.forEach((root) =>
    edges.push({
      id: `e-start-${root.id}`,
      source: "start",
      target: root.id,
      animated: false,
      style: { stroke: "#2563eb", strokeDasharray: "4 2" },
    }),
  );

  // 6) Add anchor 'finish' node
  nodes.push({
    id: "finish",
    data: { label: "Finish" },
    position: { x: 0, y: 0 },
    style: {
      border: "2px dashed #dc2626",
      padding: 10,
      background: "#fee2e2",
    },
  });
  // Edges from each leaf -> finish
  leaves.forEach((leaf) =>
    edges.push({
      id: `e-${leaf.id}-finish`,
      source: leaf.id,
      target: "finish",
      animated: false,
      style: { stroke: "#dc2626", strokeDasharray: "4 2" },
    }),
  );

  return { nodes, edges };
}

/**
 * Uses dagre to craft a nice layout from the nodes/edges for React FLow.
 */
export const getLayoutedElements = (
  nodes: XYNode[],
  edges: XYEdge[],
  dir: "LR" | "RL" | "TB" | "BT" = "TB",
) => {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 172;
  const nodeHeight = 36;

  const isHorizontal = dir === "LR";
  dagreGraph.setGraph({ rankdir: dir });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode: XYNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};
