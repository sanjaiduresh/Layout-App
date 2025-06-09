import {
  Plus,
  Save,
  Upload,
  Download,
  Trash2,
  Sun,
  Moon,
  Copy,
  ClipboardPaste,
  Undo,
  Redo,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

type PanelShape =
  | "rectangle"
  | "ellipse"
  | "circle"
  | "triangle"
  | "hexagon"
  | "star"
  | "pentagon"
  | "diamond";

interface ToolbarProps {
  onAddPanel: (shape: PanelShape) => void;
  onExportConfig: () => void;
  onImportConfig: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportToPNG: () => void;
  onClearPanels: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasFgColor: string;
  roundedCorners: boolean;
  showGrid: boolean;
  onCanvasDimensionSubmit: (width: string, height: string) => void;
  onBgColorChange: (color: string) => void;
  onFgColorChange: (color: string) => void;
  onRoundedCornersToggle: () => void;
  onShowGridToggle: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canCopy: boolean;
  canPaste: boolean;
}

const ShapeIcon = ({
  shape,
  size = 20,
  className = "",
}: {
  shape: PanelShape;
  size?: number;
  className?: string;
}) => {
  const iconProps = { width: size, height: size, className };

  switch (shape) {
    case "rectangle":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="6" width="18" height="12" rx="1" />
        </svg>
      );
    case "circle":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
    case "ellipse":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="12" rx="9" ry="6" />
        </svg>
      );
    case "triangle":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,4 20,18 4,18" />
        </svg>
      );
    case "diamond":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      );
    case "hexagon":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" />
        </svg>
      );
    case "pentagon":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,9 18,20 6,20 2,9" />
        </svg>
      );
    case "star":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Toolbar({
  onAddPanel,
  onExportConfig,
  onImportConfig,
  onExportToPNG,
  onClearPanels,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
  canvasWidth,
  canvasHeight,
  canvasBgColor,
  canvasFgColor,
  roundedCorners,
  showGrid,
  onCanvasDimensionSubmit,
  onBgColorChange,
  onFgColorChange,
  onRoundedCornersToggle,
  onShowGridToggle,
  canUndo,
  canRedo,
  canCopy,
  canPaste,
}: ToolbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [selectedShape, setSelectedShape] = useState<PanelShape>("rectangle");
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [widthInput, setWidthInput] = useState(canvasWidth.toString());
  const [heightInput, setHeightInput] = useState(canvasHeight.toString());
  const isDark = theme === "dark";

  const shapes: PanelShape[] = [
    "rectangle",
    "ellipse",
    "circle",
    "triangle",
    "hexagon",
    "star",
    "pentagon",
    "diamond",
  ];

  const handleShapeSelect = (shape: PanelShape) => {
    setSelectedShape(shape);
    setShowShapeDropdown(false);
    onAddPanel(shape);
  };

  const handleDimensionSubmit = () => {
    onCanvasDimensionSubmit(widthInput, heightInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDimensionSubmit();
    }
  };

  return (
    <div className="mb-4 font-sans">
      {/* Header */}
      <div
        className={`px-6 py-2.5 ${
          isDark
            ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white"
            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900"
        } shadow-sm`}
      >
        <h1 className="text-xl font-bold tracking-tight">Layout Designer</h1>
      </div>

      {/* Ribbon */}
      <div
        className={`${
          isDark ? "bg-gray-900" : "bg-white"
        } border-b border-gray-200 shadow-md`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center gap-6 flex-wrap">
            {/* Create Group */}
            <div className="flex flex-col min-w-[120px]">
              <div className="relative mb-2">
                <button
                  onClick={() => setShowShapeDropdown(!showShapeDropdown)}
                  className={`flex flex-col items-center px-4 py-2.5 rounded-lg ${
                    isDark
                      ? "text-blue-300 hover:bg-blue-900/50"
                      : "text-blue-600 hover:bg-blue-100"
                  } transition-all duration-200 hover:shadow-sm hover:scale-105 group border border-dashed ${
                    isDark ? "border-gray-600" : "border-gray-300"
                  }`}
                  title="Add a Panel"
                >
                  <div className="flex items-center gap-2">
                    <Plus size={24} />
                    <ShapeIcon shape={selectedShape} size={24} />
                  </div>
                  <span className="text-xs font-medium mt-1.5">New Panel</span>
                </button>
                {showShapeDropdown && (
                  <div
                    className={`absolute top-full left-0 mt-2 p-3 rounded-lg shadow-xl border z-50 ${
                      isDark
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="grid grid-cols-4 gap-3 w-72">
                      {shapes.map((shape) => (
                        <button
                          key={shape}
                          onClick={() => handleShapeSelect(shape)}
                          className={`flex flex-col items-center px-2 py-2.5 rounded-md ${
                            selectedShape === shape
                              ? isDark
                                ? "bg-blue-700 text-white"
                                : "bg-blue-200 text-blue-700"
                              : isDark
                              ? "hover:bg-gray-700 text-gray-300"
                              : "hover:bg-gray-100 text-gray-600"
                          } transition-all duration-200`}
                          title={shape.charAt(0).toUpperCase() + shape.slice(1)}
                        >
                          <ShapeIcon shape={shape} size={28} />
                          <span className="text-xs font-medium capitalize mt-1">
                            {shape}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-700"
                } text-center`}
              >
                Create
              </div>
            </div>

            {/* Separator */}
            <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

            {/* File Group */}
            <div className="flex flex-col min-w-[180px]">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={onExportConfig}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                    isDark
                      ? "text-blue-300 hover:bg-blue-900/50"
                      : "text-blue-600 hover:bg-blue-100"
                  } transition-all duration-200 hover:shadow-sm hover:scale-105`}
                  title="Save Configuration"
                >
                  <Save size={24} />
                  <span className="text-xs font-medium mt-1">Save</span>
                </button>
                <label
                  className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                    isDark
                      ? "text-blue-300 hover:bg-blue-900/50"
                      : "text-blue-600 hover:bg-blue-100"
                  } transition-all duration-200 hover:shadow-sm hover:scale-105 cursor-pointer`}
                  title="Import Configuration"
                >
                  <Upload size={24} />
                  <span className="text-xs font-medium mt-1">Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={onImportConfig}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={onExportToPNG}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                    isDark
                      ? "text-purple-300 hover:bg-blue-900/50"
                      : "text-purple-600 hover:bg-blue-100"
                  } transition-all duration-200 hover:shadow-sm hover:scale-105`}
                  title="Export to PNG"
                >
                  <Download size={24} />
                  <span className="text-xs font-medium mt-1">Export</span>
                </button>
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-700"
                } text-center`}
              >
                File
              </div>
            </div>

            {/* Separator */}
            <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

            {/* Edit Group */}
            <div className="flex flex-col min-w-[240px]">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={onCopy}
                  className={`flex flex-col items-center px-2.5 py-2 rounded-lg ${
                    canCopy
                      ? isDark
                        ? "text-teal-300 hover:bg-blue-900/50"
                        : "text-teal-600 hover:bg-blue-100"
                      : "text-gray-500 cursor-not-allowed"
                  } transition-all duration-200 hover:shadow-sm hover:scale-105`}
                  title="Copy Panel"
                  disabled={!canCopy}
                >
                  <Copy size={22} />
                  <span className="text-xs font-medium mt-1">Copy</span>
                </button>
                <button
                  onClick={onPaste}
                  className={`flex flex-col items-center px-2.5 py-2 rounded-lg ${
                    canPaste
                      ? isDark
                        ? "text-teal-300 hover:bg-blue-900/50"
                        : "text-teal-600 hover:bg-blue-100"
                      : "text-gray-500 cursor-not-allowed"
                  } transition-all duration-200 hover:shadow-sm hover:scale-105`}
                  title="Paste Panel"
                  disabled={!canPaste}
                >
                  <ClipboardPaste size={22} />
                  <span className="text-xs font-medium mt-1">Paste</span>
                </button>
                <button
                  onClick={onUndo}
                  className={`flex flex-col items-center px-2.5 py-2 rounded-lg ${
                    canUndo
                      ? isDark
                        ? "text-yellow-300 hover:bg-blue-900/50"
                        : "text-yellow-600 hover:bg-blue-100"
                      : "text-gray-500 cursor-not-allowed"
                  } transition-all duration-200 hover:shadow-sm hover:scale-105`}
                  title="Undo"
                  disabled={!canUndo}
                >
                  <Undo size={22} />
                  <span className="text-xs font-medium mt-1">Undo</span>
                </button>
                <button
                  onClick={onRedo}
                  className={`flex flex-col items-center px-2.5 py-2 rounded-lg ${
                    canRedo
                      ? isDark
                        ? "text-yellow-300 hover:bg-blue-900/50"
                        : "text-yellow-600 hover:bg-blue-100"
                      : "text-gray-500 cursor-not-allowed"
                  } transition-all duration-200 hover:shadow-sm hover:scale-105`}
                  title="Redo"
                  disabled={!canRedo}
                >
                  <Redo size={22} />
                  <span className="text-xs font-medium mt-1">Redo</span>
                </button>
                <button
                  onClick={onClearPanels}
                  className={`flex flex-col items-center px-2.5 py-2 rounded-lg ${
                    isDark
                      ? "text-red-300 hover:bg-blue-900/50"
                      : "text-red-600 hover:bg-blue-100"
                  } transition-all duration-200 hover:shadow-sm hover:scale-105`}
                  title="Clear All Panels"
                >
                  <Trash2 size={22} />
                  <span className="text-xs font-medium mt-1">Clear</span>
                </button>
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-700"
                } text-center`}
              >
                Edit
              </div>
            </div>

            {/* Separator */}
            <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

            {/* Settings Group */}
            <div className="flex flex-col min-w-[280px]">
              <div className="flex flex-wrap gap-3 mb-2 items-center">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={widthInput}
                      onChange={(e) => setWidthInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className={`w-16 h-8 text-sm font-mono rounded-md border ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-800"
                      } px-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                      min="200"
                      max="1200"
                      title="Canvas Width"
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      ×
                    </span>
                    <input
                      type="number"
                      value={heightInput}
                      onChange={(e) => setHeightInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className={`w-16 h-8 text-sm font-mono rounded-md border ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-800 text-gray-800"
                      } px-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                      min="200"
                      max="1200"
                      title="Canvas Height"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <input
                    type="color"
                    value={canvasBgColor}
                    onChange={(e) => onBgColorChange(e.target.value)}
                    className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all duration-200"
                    title="Background Color"
                  />
                  <span className="text-xs font-medium mt-1 text-gray-500">BG</span>
                </div>
                <div className="flex flex-col items-center">
                  <input
                    type="color"
                    value={canvasFgColor}
                    onChange={(e) => onFgColorChange(e.target.value)}
                    className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all duration-200"
                    title="Foreground Color"
                  />
                  <span className="text-xs font-medium mt-1 text-gray-500">FG</span>
                </div>
                <div className="flex flex-col items-center">
                  <button
                    onClick={onRoundedCornersToggle}
                    className={`relative inline-flex h-5 w-10 rounded-full transition-all duration-200 ${
                      roundedCorners
                        ? isDark
                          ? "bg-blue-500"
                          : "bg-blue-400"
                        : isDark
                          ? "bg-gray-600"
                          : "bg-gray-200"
                    } hover:ring-2 hover:ring-blue-300`}
                    title="Rounded Corners"
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        roundedCorners ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium mt-1 text-gray-500">Corners</span>
                </div>
                <div className="flex flex-col items-center">
                  <button
                    onClick={onShowGridToggle}
                    className={`relative inline-flex h-5 w-10 rounded-full transition-all duration-200 ${
                      showGrid
                        ? isDark
                          ? "bg-blue-500"
                          : "bg-blue-400"
                        : isDark
                          ? "bg-gray-600"
                          : "bg-gray-200"
                    } hover:ring-2 hover:ring-blue-300`}
                    title="Show Grid"
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        showGrid ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium mt-1 text-gray-500">Grid</span>
                </div>
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-700"
                } text-center`}
              >
                Settings
              </div>
            </div>

            {/* Separator */}
            <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

            {/* View Group */}
            <div className="flex flex-col">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={toggleTheme}
                  className={`flex flex-col items-center px-4 py-2 rounded-lg ${
                    isDark
                      ? "text-blue-300 hover:bg-blue-900/50"
                      : "text-blue-600 hover:bg-blue-100"
                  } transition-all duration-200 hover:shadow-sm hover:scale-105`}
                  title={`Switch to ${isDark ? "Light" : "Dark"} Theme`}
                >
                    {isDark ? <Sun size={22} /> : <Moon size={22} />}
                    <span className="text-xs font-medium mt-1">Theme</span>
                </button>
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-700"
                } text-center`}
              >
                View
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click Outside to close Dropdown */}
      {showShapeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShapeDropdown(false)}
        />
      )}
    </div>
  );
}