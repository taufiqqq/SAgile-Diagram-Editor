import { useCallback, useEffect, useState } from "react";
import { useKeyPress, useReactFlow, type KeyCode } from "@xyflow/react";

function useShortcut(keyCode: KeyCode, callback: Function): void {
  const [didRun, setDidRun] = useState(false);
  const shouldRun = useKeyPress(keyCode);

  useEffect(() => {
    if (shouldRun && !didRun) {
      callback();
      setDidRun(true);
    } else {
      setDidRun(shouldRun);
    }
  }, [shouldRun, didRun, callback]);
}

export function useSelectAll() {
  const { getNodes, setNodes } = useReactFlow();

  const selectAll = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        selected: true,
      }))
    );
  }, [setNodes]);

  // Listen for "Ctrl + A" or "Meta + A"
  useShortcut(["Meta+a", "Control+a"], selectAll);

  return { selectAll };
}