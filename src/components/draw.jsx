import { Renderer, TLShape, TLShapeUtil, Vec } from "@tldraw/core";

export default function Core() {
  const [page, setPage] = React.useState({
    id: "page",
    shapes: {
      box1: {
        id: "box1",
        type: "box",
        parentId: "page",
        childIndex: 0,
        point: [0, 0],
        size: [100, 100],
        rotation: 0,
      },
    },
    bindings: {},
  });

  const [pageState, setPageState] = React.useState({
    id: "page",
    selectedIds: [],
    camera: {
      point: [0, 0],
      zoom: 1,
    },
  });

  return <Renderer page={page} pageState={pageState} shapeUtils={shapeUtils} />;
}
