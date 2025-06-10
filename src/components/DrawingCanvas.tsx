import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Plus } from "lucide-react";
import html2canvas from "html2canvas";
import {
  CanvasConfig,
  Panel,
  ResizeStartPos,
  ResizingPanel,
  PanelShape,
} from "../types/canvas";
import Toolbar from "./ToolBar";
import { useCanvasState } from "../hooks/useCanvasState";
import PanelComponent from "./Panel";

// Guideline Interface
interface Guideline {
  type: "horizontal" | "vertical";
  position: number; // x for vertical, y for horizontal
}

export default function DrawingCanvas() {
  const { theme } = useTheme();
  const { state, actions } = useCanvasState();
  const {
    panels,
    selectedPanel,
    canvasWidth,
    canvasHeight,
    canvasBgColor,
    canvasFgColor,
    roundedCorners,
    showGrid,
    past,
    future,
  } = state;
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [resizingPanel, setResizingPanel] = useState<ResizingPanel | null>(null);
  const [resizingCanvas, setResizingCanvas] = useState<string | null>(null);
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const resizeStartPos = useRef<ResizeStartPos | null>(null);
  const [, setNewWidth] = useState("");
  const [, setNewHeight] = useState("");
  const [, setNewCanvasWidth] = useState("");
  const [, setNewCanvasHeight] = useState("");
  const [copiedPanel, setCopiedPanel] = useState<Panel | null>(null);

  // Alignment threshold (pixels)
  const ALIGNMENT_THRESHOLD = 5;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingPanel && resizeStartPos.current) {
        const { id, corner } = resizingPanel;
        const {
          x: startX,
          y: startY,
          width: startWidth,
          height: startHeight,
          panelX,
          panelY,
        } = resizeStartPos.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const panel = panels.find((p) => p.id === id);
        const isCircle = panel?.shape === "circle";
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = panelX;
        let newY = panelY;

        if (corner === "bottom-right") {
          const maxWidth = canvasWidth - panelX;
          const maxHeight = canvasHeight - panelY;
          newWidth = Math.max(50, Math.min(startWidth + deltaX, maxWidth));
          newHeight = Math.max(50, Math.min(startHeight + deltaY, maxHeight));
          if (isCircle) {
            const maxSize = Math.min(maxWidth, maxHeight);
            const newSize = Math.max(50, Math.min(Math.max(newWidth, newHeight), maxSize));
            newWidth = newSize;
            newHeight = newSize;
          }
        } else if (corner === "top-left") {
          const potentialWidth = Math.max(50, startWidth - deltaX);
          const potentialHeight = Math.max(50, startHeight - deltaY);
          const potentialX = panelX + (startWidth - potentialWidth);
          const potentialY = panelY + (startHeight - potentialHeight);
          newX = Math.max(0, potentialX);
          newY = Math.max(0, potentialY);
          newWidth = Math.min(potentialWidth, panelX + startWidth);
          newHeight = Math.min(potentialHeight, panelY + startHeight);
          if (isCircle) {
            const maxSize = Math.min(panelX + startWidth, panelY + startHeight);
            const newSize = Math.max(50, Math.min(Math.max(newWidth, newHeight), maxSize));
            newWidth = newSize;
            newHeight = newSize;
            newX = Math.max(0, panelX + (startWidth - newWidth));
            newY = Math.max(0, panelY + (startHeight - newHeight));
          }
        } else if (corner === "top-right") {
          const maxWidth = canvasWidth - panelX;
          const constrainedWidth = Math.max(50, Math.min(startWidth + deltaX, maxWidth));
          newWidth = constrainedWidth;
          const potentialHeight = Math.max(50, startHeight - deltaY);
          const potentialY = panelY + (startHeight - potentialHeight);
          newY = Math.max(0, potentialY);
          const maxHeight = panelY + startHeight - newY;
          newHeight = Math.min(potentialHeight, maxHeight);
          if (isCircle) {
            const maxWidthForCircle = canvasWidth - panelX;
            const maxHeightForCircle = panelY + startHeight;
            const maxSize = Math.min(maxWidthForCircle, maxHeightForCircle);
            const newSize = Math.max(50, Math.min(Math.max(constrainedWidth, newHeight), maxSize));
            newWidth = newSize;
            newHeight = newSize;
            newY = Math.max(0, panelY + (startHeight - newHeight));
          }
        } else if (corner === "bottom-left") {
          const potentialWidth = Math.max(50, startWidth - deltaX);
          const potentialX = panelX + (startWidth - potentialWidth);
          newX = Math.max(0, potentialX);
          newWidth = Math.min(potentialWidth, panelX + startWidth);
          newHeight = Math.max(50, Math.min(startHeight + deltaY, canvasHeight - panelY));
          if (isCircle) {
            const maxWidth = panelX + startWidth;
            const maxHeight = canvasHeight - panelY;
            const maxSize = Math.min(maxWidth, maxHeight);
            const newSize = Math.max(50, Math.min(Math.max(newWidth, newHeight), maxSize));
            newWidth = newSize;
            newHeight = newSize;
            newX = Math.max(0, panelX + (startWidth - newWidth));
          }
        }

        actions.updatePanel(id, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      } else if (resizingCanvas && resizeStartPos.current) {
        const { x: startX, y: startY, width: startWidth, height: startHeight } = resizeStartPos.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        let newCanvasWidth = startWidth;
        let newCanvasHeight = startHeight;

        if (resizingCanvas === "bottom-right") {
          newCanvasWidth = Math.max(200, Math.min(startWidth + deltaX, 1200));
          newCanvasHeight = Math.max(200, Math.min(startHeight + deltaY, 1200));
        } else if (resizingCanvas === "top-left") {
          newCanvasWidth = Math.max(200, Math.min(startWidth - deltaX, 1200));
          newCanvasHeight = Math.max(200, Math.min(startHeight - deltaY, 1200));
        } else if (resizingCanvas === "top-right") {
          newCanvasWidth = Math.max(200, Math.min(startWidth + deltaX, 1200));
          newCanvasHeight = Math.max(200, Math.min(startHeight - deltaY, 1200));
        } else if (resizingCanvas === "bottom-left") {
          newCanvasWidth = Math.max(200, Math.min(startWidth - deltaX, 1200));
          newCanvasHeight = Math.max(200, Math.min(startHeight + deltaY, 1200));
        }

        actions.setCanvasDimensions(newCanvasWidth, newCanvasHeight);
      }
    };

    const handleMouseUp = () => {
      setResizingPanel(null);
      setResizingCanvas(null);
      resizeStartPos.current = null;
      setGuidelines([]); // Clear guidelines on mouse up
    };

    if (resizingPanel || resizingCanvas) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingPanel, resizingCanvas, canvasWidth, canvasHeight, panels, actions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(true);
      } else if (e.ctrlKey && e.key.toLowerCase() === "c" && selectedPanel) {
        e.preventDefault();
        const panel = panels.find((p) => p.id === selectedPanel);
        if (panel) {
          setCopiedPanel({ ...panel });
        }
      } else if (e.ctrlKey && e.key.toLowerCase() === "v" && copiedPanel) {
        e.preventDefault();
        handlePaste();
      } else if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        actions.undo();
      } else if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        actions.redo();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isCtrlPressed, selectedPanel, copiedPanel, panels, actions]);

  const startResizing = (e: React.MouseEvent, id: string, corner: string) => {
    e.stopPropagation();
    const panel = panels.find((p) => p.id === id);
    if (panel) {
      resizeStartPos.current = {
        x: e.clientX,
        y: e.clientY,
        width: panel.width,
        height: panel.height,
        panelX: panel.x,
        panelY: panel.y,
      };
      setResizingPanel({ id, corner });
      actions.setSelectedPanel(id);
    }
  };

  const startResizingCanvas = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: canvasWidth,
      height: canvasHeight,
      panelX: 0,
      panelY: 0,
    };
    setResizingCanvas(corner);
  };

  const addPanel = (shape: PanelShape = "rectangle") => {
    const canvas = document.querySelector(".canvas-container");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2 - 50;
      const y = rect.height / 2 - 50;
      const maxZIndex = panels.length > 0 ? Math.max(...panels.map((p) => p.zIndex)) : 0;
      const allowedPanelShapes = [
        "rectangle",
        "circle",
        "ellipse",
        "triangle",
        "hexagon",
        "pentagon",
        "star",
        "diamond",
      ] as const;
      type AllowedPanelShape = (typeof allowedPanelShapes)[number];
      const panelShape: AllowedPanelShape = allowedPanelShapes.includes(shape as AllowedPanelShape)
        ? (shape as AllowedPanelShape)
        : "rectangle";
      const newPanel: Panel = {
        id: crypto.randomUUID(),
        title: `Panel ${panels.length + 1}`,
        x,
        y,
        width: 400,
        height: panelShape === "circle" ? 400 : 400,
        zIndex: maxZIndex + 1,
        shape: panelShape,
      };
      actions.addPanel(newPanel);
    }
  };

  const removePanel = (id: string) => {
    actions.removePanel(id);
  };

  const handleDrag = (id: string, e: any, data: { x: number; y: number }) => {
    // Update panel position
    actions.updatePanelPosition(id, data.x, data.y);

    // Calculate guidelines
    const panel = panels.find((p) => p.id === id);
    if (!panel) return;

    const newGuidelines: Guideline[] = [];
    const panelLeft = data.x;
    const panelRight = data.x + panel.width;
    const panelTop = data.y;
    const panelBottom = data.y + panel.height;
    const panelCenterX = data.x + panel.width / 2;
    const panelCenterY = data.y + panel.height / 2;
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;

    // Check alignment with canvas center
    if (Math.abs(panelCenterX - canvasCenterX) < ALIGNMENT_THRESHOLD) {
      newGuidelines.push({ type: "vertical", position: canvasCenterX });
    }
    if (Math.abs(panelCenterY - canvasCenterY) < ALIGNMENT_THRESHOLD) {
      newGuidelines.push({ type: "horizontal", position: canvasCenterY });
    }

    // Check alignment with other panels
    panels.forEach((otherPanel) => {
      if (otherPanel.id === id) return; // Skip the dragged panel

      const otherLeft = otherPanel.x;
      const otherRight = otherPanel.x + otherPanel.width;
      const otherTop = otherPanel.y;
      const otherBottom = otherPanel.y + otherPanel.height;
      const otherCenterX = otherPanel.x + otherPanel.width / 2;
      const otherCenterY = otherPanel.y + otherPanel.height / 2;

      // Vertical alignments (left, center, right)
      if (Math.abs(panelLeft - otherLeft) < ALIGNMENT_THRESHOLD) {
        newGuidelines.push({ type: "vertical", position: otherLeft });
      }
      if (Math.abs(panelLeft - otherRight) < ALIGNMENT_THRESHOLD) {
        newGuidelines.push({ type: "vertical", position: otherRight });
      }
      if (Math.abs(panelRight - otherLeft) < ALIGNMENT_THRESHOLD) {
        newGuidelines.push({ type: "vertical", position: otherLeft });
      }
      if (Math.abs(panelRight - otherRight) < ALIGNMENT_THRESHOLD) {
        newGuidelines.push({ type: "vertical", position: otherRight });
      }
      if (Math.abs(panelCenterX - otherCenterX) < ALIGNMENT_THRESHOLD) {
        newGuidelines.push({ type: "vertical", position: otherCenterX });
      }

      // Horizontal alignments (top, center, bottom)
      if (Math.abs(panelTop - otherTop) < ALIGNMENT_THRESHOLD) {
        newGuidelines.push({ type: "horizontal", position: otherTop });
      }
      if (Math.abs(panelTop - otherBottom) < ALIGNMENT_THRESHOLD) {
        newGuidelines.push({ type: "horizontal", position: otherBottom });
      }
      if (Math.abs(panelBottom - otherTop) < ALIGNMENT_THRESHOLD) {
        newGuidelines.push({ type: "horizontal", position: otherTop });
      }
      if (Math.abs(panelBottom - otherBottom) < ALIGNMENT_THRESHOLD) {
        newGuidelines.push({ type: "horizontal", position: otherBottom });
      }
      if (Math.abs(panelCenterY - otherCenterY) < ALIGNMENT_THRESHOLD) {
        newGuidelines.push({ type: "horizontal", position: otherCenterY });
      }
    });

    setGuidelines(newGuidelines);
  };

  const handleDragStop = (id: string, e: any, data: { x: number; y: number }) => {
    actions.updatePanelPosition(id, data.x, data.y);
    setGuidelines([]); // Clear guidelines when dragging stops
  };

  const handleDimensionClick = (panel: Panel) => {
    actions.setEditingStates(panel.id);
    setNewWidth(panel.width.toString());
    setNewHeight(panel.height.toString());
  };

  const handleCanvasDimensionClick = () => {
    setNewCanvasWidth(canvasWidth.toString());
    setNewCanvasHeight(canvasHeight.toString());
  };

  const handleCanvasDimensionSubmit = (width: string, height: string) => {
    const newWidth = parseInt(width);
    const newHeight = parseInt(height);
    if (!isNaN(newWidth) && !isNaN(newHeight) && newWidth >= 200 && newHeight >= 200) {
      actions.setCanvasDimensions(newWidth, newHeight);
    }
  };

  const exportToPNG = () => {
    const canvas = document.querySelector(".canvas-container");
    if (canvas) {
      html2canvas(canvas as HTMLElement, {
        backgroundColor: canvasBgColor,
        scale: 2,
        logging: false,
      }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement("a");
        link.download = "panel-drawing.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  const exportConfig = () => {
    const config: CanvasConfig = {
      panels,
      canvasWidth,
      canvasHeight,
      canvasBgColor,
      canvasFgColor,
      roundedCorners,
      showGrid,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "panel-layout.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config: CanvasConfig = JSON.parse(e.target?.result as string);
          actions.loadConfig(config);
        } catch (error) {
          console.error("Error importing configuration:", error);
          alert("Error importing configuration. Please check the file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const clearPanels = () => {
    actions.clearPanels();
  };

  const handleBgColorChange = (color: string) => {
    actions.setCanvasColors(color);
  };

  const handleFgColorChange = (color: string) => {
    actions.setCanvasColors(undefined, color);
  };

  const handleRoundedCornersToggle = () => {
    actions.setCanvasOptions(!roundedCorners);
  };

  const handleShowGridToggle = () => {
    actions.setCanvasOptions(undefined, !showGrid);
  };

  const handleCopy = () => {
    if (selectedPanel) {
      const panel = panels.find((p) => p.id === selectedPanel);
      if (panel) {
        setCopiedPanel({ ...panel });
      }
    }
  };

  const handlePaste = () => {
    if (copiedPanel) {
      const maxZIndex = panels.length > 0 ? Math.max(...panels.map((p) => p.zIndex)) : 0;
      const newPanel: Panel = {
        ...copiedPanel,
        id: crypto.randomUUID(),
        title: `${copiedPanel.title} (Copy)`,
        x: copiedPanel.x + 20,
        y: copiedPanel.y + 20,
        zIndex: maxZIndex + 1,
      };
      actions.addPanel(newPanel);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Toolbar
        onAddPanel={addPanel}
        onExportConfig={exportConfig}
        onImportConfig={importConfig}
        onExportToPNG={exportToPNG}
        onClearPanels={clearPanels}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onUndo={actions.undo}
        onRedo={actions.redo}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        canvasBgColor={canvasBgColor}
        canvasFgColor={canvasFgColor}
        roundedCorners={roundedCorners}
        showGrid={showGrid}
        onCanvasDimensionSubmit={handleCanvasDimensionSubmit}
        onBgColorChange={handleBgColorChange}
        onFgColorChange={handleFgColorChange}
        onRoundedCornersToggle={handleRoundedCornersToggle}
        onShowGridToggle={handleShowGridToggle}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        canCopy={!!selectedPanel}
        canPaste={!!copiedPanel}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <div className="relative">
            <div
              className={`relative border-2 canvas-container transition-colors duration-200 overflow-hidden ${
                roundedCorners ? "rounded-xl" : ""
              } ${showGrid ? "grid-background" : ""}`}
              style={{
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: canvasBgColor,
                color: canvasFgColor,
                backgroundImage: showGrid
                  ? `linear-gradient(${
                      theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    } 1px, transparent 1px),
                     linear-gradient(90deg, ${
                       theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                     } 1px, transparent 1px)`
                  : "none",
                backgroundSize: showGrid ? "20px 20px" : "auto",
              }}
            >
              {/* Render Guidelines */}
              {guidelines.map((guideline, index) => (
                <div
                  key={`guideline-${index}`}
                  className="absolute"
                  style={
                    guideline.type === "vertical"
                      ? {
                          left: guideline.position,
                          top: 0,
                          width: "1px",
                          height: "100%",
                          background: "red",
                          borderLeft: "1px dashed red",
                          zIndex: 9999,
                        }
                      : {
                          top: guideline.position,
                          left: 0,
                          width: "100%",
                          height: "1px",
                          background: "red",
                          borderTop: "1px dashed red",
                          zIndex: 9999,
                        }
                  }
                />
              ))}
              {/* Canvas Resize Handles */}
              <div className="absolute inset-0 flex items-center justify-center border-2 border-transparent hover:border-blue-500 transition-colors duration-200 border-dashed">
                <div
                  className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 hover:opacity-100 z-30"
                  onMouseDown={(e) => startResizingCanvas(e, "top-left")}
                />
                <div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize opacity-0 hover:opacity-100 z-30"
                  onMouseDown={(e) => startResizingCanvas(e, "top-right")}
                />
                <div
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize opacity-0 hover:opacity-100 z-30"
                  onMouseDown={(e) => startResizingCanvas(e, "bottom-left")}
                />
                <div
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 hover:opacity-100 z-30"
                  onMouseDown={(e) => startResizingCanvas(e, "bottom-right")}
                />
              </div>
              {panels.length > 0 ? (
                panels.map((panel) => (
                  <PanelComponent
                    key={panel.id}
                    panel={panel}
                    theme={theme}
                    isCtrlPressed={isCtrlPressed}
                    moveMode={moveMode}
                    resizingPanel={resizingPanel}
                    selectedPanel={selectedPanel}
                    roundedCorners={roundedCorners}
                    actions={actions}
                    onDrag={handleDrag}
                    onDragStop={handleDragStop}
                    onStartResizing={startResizing}
                    onRemovePanel={removePanel}
                    onDimensionClick={handleDimensionClick}
                  />
                ))
              ) : (
                <div
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  No panels available. Click the <Plus size={16} className="inline" /> button to add a panel.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer ${
              theme === "dark" ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            } transition-colors`}
            onClick={handleCanvasDimensionClick}
          >
            <span className="text-sm font-mono">
              Canvas: {canvasWidth} × {canvasHeight}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}