import React, { useState } from "react";
import { Trash2, Move, Pencil } from "lucide-react";
import Draggable from "react-draggable";
import { Panel, ResizingPanel } from "../types/canvas";
import SVGShape from "./SVGShape";
import EditPanelPopup from "./EditPanelPopup";

interface PanelComponentProps {
  panel: Panel;
  theme: string;
  isCtrlPressed: boolean;
  moveMode: boolean;
  resizingPanel: ResizingPanel | null;
  selectedPanel: string | null;
  roundedCorners: boolean;
  actions: {
    setSelectedPanel: (id: string) => void;
    updatePanel: (id: string, updates: Partial<Panel>) => void;
    removePanel: (id: string) => void;
    setEditingStates: (panelId?: string, isEditingCanvas?: boolean) => void;
  };
  onDrag: (id: string, e: any, data: { x: number; y: number }) => void; // Added onDrag prop
  onDragStop: (id: string, e: any, data: { x: number; y: number }) => void;
  onStartResizing: (e: React.MouseEvent, id: string, corner: string) => void;
  onRemovePanel: (id: string) => void;
  onDimensionClick: (panel: Panel) => void;
}

export default function PanelComponent({
  panel,
  theme,
  isCtrlPressed,
  moveMode,
  resizingPanel,
  selectedPanel,
  roundedCorners,
  actions,
  onDrag, // Added to props
  onDragStop,
  onStartResizing,
  onRemovePanel,
  onDimensionClick,
}: PanelComponentProps) {
  const [showEditPopup, setShowEditPopup] = useState(false);

  const handleTitleChange = (id: string, value: string) => {
    actions.updatePanel(id, { title: value });
  };

  const toggleMoveMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Assuming moveMode is managed in parent; could pass a callback if needed
  };

  return (
    <Draggable
      key={panel.id}
      position={{ x: panel.x, y: panel.y }}
      onDrag={(e, data) => onDrag(panel.id, e, data)} // Added onDrag handler
      onStop={(e, data) => onDragStop(panel.id, e, data)}
      bounds="parent"
      disabled={(!isCtrlPressed && !moveMode) || !!resizingPanel}
    >
      <div
        className={`absolute ${selectedPanel === panel.id ? "z-10" : "z-0"}`}
        style={{ zIndex: panel.zIndex }}
        onClick={(e) => {
          e.stopPropagation();
          actions.setSelectedPanel(panel.id);
        }}
      >
        <div className="relative group select-none">
          <div className="relative" style={{ width: panel.width, height: panel.height }}>
            {/* Shape Background */}
            {panel.shape === "rectangle" ? (
              <div
                className={`w-full h-full ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-500"
                    : "bg-white border-gray-300"
                } ${roundedCorners ? "rounded-lg" : ""} border-2 transition-colors duration-200`}
              />
            ) : panel.shape === "circle" ? (
              <div
                className={`w-full h-full ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-500"
                    : "bg-white border-gray-300"
                } rounded-full border-2 transition-colors duration-200`}
              />
            ) : panel.shape === "ellipse" ? (
              <div
                className={`w-full h-full ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-500"
                    : "bg-white border-gray-300"
                } border-2 transition-colors duration-200`}
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <SVGShape
                shape={panel.shape}
                width={panel.width}
                height={panel.height}
                fillColor={theme === "dark" ? "#374151" : "#ffffff"}
                strokeColor={theme === "dark" ? "#6b7280" : "#d1d5db"}
                strokeWidth={2}
              />
            )}

            {/* Resize Handles */}
            <div className="absolute inset-0 flex items-center justify-center border-2 border-transparent group-hover:border-blue-500 transition-colors duration-200 border-dashed">
              <div
                className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 z-20"
                onMouseDown={(e) => onStartResizing(e, panel.id, "top-left")}
              />
              <div
                className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-nesw-resize opacity-0 group-hover:opacity-100 z-20"
                onMouseDown={(e) => onStartResizing(e, panel.id, "top-right")}
              />
              <div
                className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full cursor-nesw-resize opacity-0 group-hover:opacity-100 z-20"
                onMouseDown={(e) => onStartResizing(e, panel.id, "bottom-left")}
              />
              <div
                className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 z-20"
                onMouseDown={(e) => onStartResizing(e, panel.id, "bottom-right")}
              />
            </div>

            {/* Control Buttons */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
              <div className="flex flex-col gap-1">
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePanel(panel.id);
                    }}
                    className={`p-1.5 rounded-md ${
                      theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
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
                      theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
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
                onDimensionChange={(id, updates) => actions.updatePanel(id, updates)}
                onClose={() => setShowEditPopup(!showEditPopup)}
              />
            )}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
              <button
                onClick={toggleMoveMode}
                className={`p-1.5 rounded-md ${
                  moveMode
                    ? theme === "dark" ? "bg-blue-600" : "bg-blue-500"
                    : theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                } text-white shadow-lg cursor-move transition-colors`}
              >
                <Move size={14} />
              </button>
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
              <span
                className={`text-l font-mono ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
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
                onDimensionClick(panel);
              }}
            >
              <span
                className={`text-xs font-mono ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {panel.width} × {panel.height}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}