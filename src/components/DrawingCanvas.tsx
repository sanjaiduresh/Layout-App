import React, { useReducer, useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Trash2, Move, Plus, Pencil } from "lucide-react";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import {
  CanvasConfig,
  Panel,
  CanvasState,
  ResizeStartPos,
  ResizingPanel,
  PanelShape,
} from "../types/canvas";
import Toolbar from "./ToolBar";
import { useCanvasState } from "../hooks/useCanvasState";
import EditPanelPopup from "./EditPanelPopup";
import SVGShape from "./SVGShape";


// DrawingCanvas Component
export default function DrawingCanvas() {
  const { theme } = useTheme();
  const { state, actions } = useCanvasState();
  const {
    panels,
    selectedPanel,
    editingPanel,
    canvasWidth,
    canvasHeight,
    canvasBgColor,
    canvasFgColor,
    roundedCorners,
    showGrid,
    isEditingCanvas,
    past,
    future,
  } = state;
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [resizingPanel, setResizingPanel] = useState<ResizingPanel | null>(
    null
  );
  const resizeStartPos = useRef<ResizeStartPos | null>(null);
  const [, setNewWidth] = useState("");
  const [, setNewHeight] = useState("");
  const [newCanvasWidth, setNewCanvasWidth] = useState("");
  const [newCanvasHeight, setNewCanvasHeight] = useState("");
  const [copiedPanel, setCopiedPanel] = useState<Panel | null>(null);

  // Handle resizing
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
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = Math.max(50, startHeight + deltaY);
          if (isCircle) {
            const newSize = Math.max(newWidth, newHeight);
            newWidth = newSize;
            newHeight = newSize;
          }
        } else if (corner === "top-left") {
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = Math.max(50, startHeight - deltaY);
          if (isCircle) {
            const newSize = Math.max(newWidth, newHeight);
            newWidth = newSize;
            newHeight = newSize;
            newX = panelX + (startWidth - newWidth);
            newY = panelY + (startHeight - newHeight);
          } else {
            newX = panelX + (startWidth - newWidth);
            newY = panelY + (startHeight - newHeight);
          }
        } else if (corner === "top-right") {
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = Math.max(50, startHeight - deltaY);
          if (isCircle) {
            const newSize = Math.max(newWidth, newHeight);
            newWidth = newSize;
            newHeight = newSize;
            newY = panelY + (startHeight - newHeight);
          } else {
            newY = panelY + (startHeight - newHeight);
          }
        } else if (corner === "bottom-left") {
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = Math.max(50, startHeight + deltaY);
          if (isCircle) {
            const newSize = Math.max(newWidth, newHeight);
            newWidth = newSize;
            newHeight = newSize;
            newX = panelX + (startWidth - newWidth);
          } else {
            newX = panelX + (startWidth - newWidth);
          }
        }

        actions.updatePanel(id, {
          x: Math.max(0, Math.min(newX, canvasWidth - newWidth)),
          y: Math.max(0, Math.min(newY, canvasHeight - newHeight)),
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setResizingPanel(null);
      resizeStartPos.current = null;
    };

    if (resizingPanel) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingPanel, canvasWidth, canvasHeight, panels, actions]);

  // Handle control key and copy/paste shortcuts
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

  const addPanel = (shape: PanelShape = "rectangle") => {
    const canvas = document.querySelector(".canvas-container");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2 - 50;
      const y = rect.height / 2 - 50;
      const maxZIndex =
        panels.length > 0 ? Math.max(...panels.map((p) => p.zIndex)) : 0;
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
      const panelShape: AllowedPanelShape = allowedPanelShapes.includes(
        shape as AllowedPanelShape
      )
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

  const handleTitleChange = (id: string, value: string) => {
    actions.updatePanel(id, { title: value });
  };

  const removePanel = (id: string) => {
    actions.removePanel(id);
  };

  const clearPanels = () => {
    actions.clearPanels();
    localStorage.removeItem("canvasConfig");
  };

  const handleDragStop = (
    id: string,
    e: any,
    data: { x: number; y: number }
  ) => {
    actions.updatePanelPosition(id, data.x, data.y);
  };

  const handleDimensionClick = (panel: Panel) => {
    actions.setEditingStates(panel.id);
    setNewWidth(panel.width.toString());
    setNewHeight(panel.height.toString());
  };




  const toggleMoveMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMoveMode(!moveMode);
  };

  const handleCanvasDimensionClick = () => {
    actions.setEditingStates(undefined, true);
    setNewCanvasWidth(canvasWidth.toString());
    setNewCanvasHeight(canvasHeight.toString());
  };

  const handleCanvasDimensionSubmit = () => {
    const width = parseInt(newCanvasWidth);
    const height = parseInt(newCanvasHeight);
    if (!isNaN(width) && !isNaN(height) && width >= 200 && height >= 200) {
      actions.setCanvasDimensions(width, height);
    }
    actions.setEditingStates(undefined, false);
  };

  const handleCanvasKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCanvasDimensionSubmit();
    } else if (e.key === "Escape") {
      actions.setEditingStates(undefined, false);
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

  const handleToggleSettings = () => {
    actions.setEditingStates(undefined, !isEditingCanvas);
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
      const maxZIndex =
        panels.length > 0 ? Math.max(...panels.map((p) => p.zIndex)) : 0;
      const newPanel: Panel = {
        ...copiedPanel,
        id: crypto.randomUUID(),
        title: `${copiedPanel.title} (Copy)`,
        x: copiedPanel.x + 20, // Offset for visibility
        y: copiedPanel.y + 20,
        zIndex: maxZIndex + 1,
      };
      actions.addPanel(newPanel);
    }
  };

  const [showEditPopup, setShowEditPopup] = useState(false);

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
        onToggleSettings={handleToggleSettings}
        onClearPanels={clearPanels}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onUndo={actions.undo}
        onRedo={actions.redo}
        isEditingCanvas={isEditingCanvas}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        canCopy={!!selectedPanel}
        canPaste={!!copiedPanel}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
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
                    theme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)"
                  } 1px, transparent 1px),
                   linear-gradient(90deg, ${
                     theme === "dark"
                       ? "rgba(255,255,255,0.1)"
                       : "rgba(0,0,0,0.1)"
                   } 1px, transparent 1px)`
                : "none",
              backgroundSize: showGrid ? "20px 20px" : "auto",
            }}
          >
            {isEditingCanvas && (
              <div className="absolute top-4 right-4 z-30 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={newCanvasWidth}
                      onChange={(e) => setNewCanvasWidth(e.target.value)}
                      onKeyDown={handleCanvasKeyDown}
                      className={`w-16 h-8 text-sm font-mono rounded px-2 ${
                        theme === "dark"
                          ? "bg-gray-600 text-white border-gray-500"
                          : "bg-white text-gray-900 border-gray-300"
                      } border`}
                      min="200"
                      max="1200"
                    />
                    <span
                      className={`text-sm font-mono ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      ×
                    </span>
                    <input
                      type="number"
                      value={newCanvasHeight}
                      onChange={(e) => setNewCanvasHeight(e.target.value)}
                      onKeyDown={handleCanvasKeyDown}
                      className={`w-16 h-8 text-sm font-mono rounded px-2 ${
                        theme === "dark"
                          ? "bg-gray-600 text-white border-gray-500"
                          : "bg-white text-gray-900 border-gray-300"
                      } border`}
                      min="200"
                      max="1200"
                    />
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-col gap-1">
                      <label
                        className={`text-xs font-mono ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Background
                      </label>
                      <input
                        type="color"
                        value={canvasBgColor}
                        onChange={(e) => handleBgColorChange(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        className={`text-xs font-mono ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Foreground
                      </label>
                      <input
                        type="color"
                        value={canvasFgColor}
                        onChange={(e) => handleFgColorChange(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      className={`text-xs font-mono ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Rounded Corners
                    </label>
                    <button
                      onClick={handleRoundedCornersToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        roundedCorners
                          ? theme === "dark"
                            ? "bg-blue-600"
                            : "bg-blue-500"
                          : theme === "dark"
                          ? "bg-gray-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          roundedCorners ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      className={`text-xs font-mono ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Show Grid
                    </label>
                    <button
                      onClick={handleShowGridToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showGrid
                          ? theme === "dark"
                            ? "bg-blue-600"
                            : "bg-blue-500"
                          : theme === "dark"
                          ? "bg-gray-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showGrid ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {panels.length > 0 ? (
              panels.map((panel) => (
                <Draggable
                  key={panel.id}
                  position={{ x: panel.x, y: panel.y }}
                  onStop={(e, data) => handleDragStop(panel.id, e, data)}
                  bounds="parent"
                  disabled={(!isCtrlPressed && !moveMode) || !!resizingPanel}
                >
                  <div
                    className={`absolute ${
                      selectedPanel === panel.id ? "z-10" : "z-0"
                    }`}
                    style={{ zIndex: panel.zIndex }}
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.setSelectedPanel(panel.id);
                    }}
                  >
                    <div className="relative group">
                      <div
                        className="relative"
                        style={{ width: panel.width, height: panel.height }}
                      >
                        {/* Shape Background */}
                        {panel.shape === "rectangle" ? (
                          <div
                            className={`w-full h-full ${
                              theme === "dark"
                                ? "bg-gray-700 shadow-xl shadow-gray-900/70 border-gray-500"
                                : "bg-white shadow-xl shadow-gray-300/70 border-gray-300"
                            } ${
                              roundedCorners ? "rounded-lg" : ""
                            } border-2 transition-colors duration-200`}
                          />
                        ) : panel.shape === "circle" ? (
                          <div
                            className={`w-full h-full ${
                              theme === "dark"
                                ? "bg-gray-700 shadow-xl shadow-gray-900/70 border-gray-500"
                                : "bg-white shadow-xl shadow-gray-300/70 border-gray-300"
                            } rounded-full border-2 transition-colors duration-200`}
                          />
                        ) : panel.shape === "ellipse" ? (
                          <div
                            className={`w-full h-full ${
                              theme === "dark"
                                ? "bg-gray-700 shadow-xl shadow-gray-900/70 border-gray-500"
                                : "bg-white shadow-xl shadow-gray-300/70 border-gray-300"
                            } border-2 transition-colors duration-200`}
                            style={{ borderRadius: "50%" }}
                          />
                        ) : (
                          <SVGShape
                            shape={panel.shape}
                            width={panel.width}
                            height={panel.height}
                            fillColor={theme === "dark" ? "#374151" : "#ffffff"}
                            strokeColor={
                              theme === "dark" ? "#6b7280" : "#d1d5db"
                            }
                            strokeWidth={2}
                          />
                        )}

                        {/* Resize Handles */}
                        <div className="absolute inset-0 flex items-center justify-center border-2 border-transparent group-hover:border-blue-500 transition-colors duration-200 border-dashed">
                          <div
                            className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 z-20"
                            onMouseDown={(e) =>
                              startResizing(e, panel.id, "top-left")
                            }
                          />
                          <div
                            className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-nesw-resize opacity-0 group-hover:opacity-100 z-20"
                            onMouseDown={(e) =>
                              startResizing(e, panel.id, "top-right")
                            }
                          />
                          <div
                            className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-nesw-resize opacity-0 group-hover:opacity-100 z-20"
                            onMouseDown={(e) =>
                              startResizing(e, panel.id, "bottom-left")
                            }
                          />
                          <div
                            className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 z-20"
                            onMouseDown={(e) =>
                              startResizing(e, panel.id, "bottom-right")
                            }
                          />
                        </div>

                        {/* Control Buttons */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                          <div className="flex flex-col gap-1">
                            <div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePanel(panel.id);
                                }}
                                className={`p-1.5 rounded-md ${
                                  theme === "dark"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-red-500 hover:bg-red-600"
                                } text-white shadow-lg`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowEditPopup(!showEditPopup);
                                }}
                                className={`p-1.5 rounded-md ${
                                  theme === "dark"
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-blue-500 hover:bg-blue-600"
                                } text-white shadow-lg`}
                                aria-label="Edit Panel"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                        {showEditPopup && (
                          <EditPanelPopup
                            panel={panel}
                            theme={theme}
                            onTitleChange={handleTitleChange}
                            onDimensionChange={(id, updates) =>
                              actions.updatePanel(id, updates)
                            }
                            onClose={() => setShowEditPopup(!showEditPopup)}
                          />
                        )}
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                          <button
                            onClick={toggleMoveMode}
                            className={`p-1.5 rounded-md ${
                              moveMode
                                ? theme === "dark"
                                  ? "bg-blue-600"
                                  : "bg-blue-500"
                                : theme === "dark"
                                ? "bg-gray-600"
                                : "bg-gray-200"
                            } text-white shadow-lg cursor-move transition-colors`}
                          >
                            <Move size={14} />
                          </button>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
                    
                            <span
                              className={`text-l font-mono ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              } text-center max-w-full overflow-hidden`}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                actions.setEditingStates(panel.id);
                              }}
                              style={{
                                position: "relative",
                                zIndex: 25,
                                textShadow:
                                  theme === "dark"
                                    ? "1px 1px 2px rgba(0,0,0,0.8)"
                                    : "1px 1px 2px rgba(255,255,255,0.8)",
                              }}
                            >
                              {panel.title || "Untitled"}
                            </span>
                        </div>
                        <div
                          className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDimensionClick(panel);
                          }}
                        >
                            <span
                              className={`text-xs font-mono ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {panel.width} × {panel.height}
                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Draggable>
              ))
            ) : (
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No panels available. Click the{" "}
                <Plus size={16} className="inline" /> button to add a panel.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer ${
              theme === "dark"
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
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
