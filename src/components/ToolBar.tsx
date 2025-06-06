import { Plus, Save, Upload, Download, Trash2, Settings, Sun, Moon, Copy, ClipboardPaste, Undo, Redo } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

type PanelShape = "rectangle" | "ellipse" | "circle" | "triangle" | "hexagon" | "star" | "pentagon" | "diamond";

interface ToolbarProps {
  onAddPanel: (shape: PanelShape) => void;
  onExportConfig: () => void;
  onImportConfig: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportToPNG: () => void;
  onToggleSettings: () => void;
  onClearPanels: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  isEditingCanvas: boolean;
  canUndo: boolean;
  canRedo: boolean;
  canCopy: boolean;
  canPaste: boolean;
}

// Shape components for visual representation
const ShapeIcon = ({ shape, size = 20, className = "" }: { shape: PanelShape; size?: number; className?: string }) => {
  const iconProps = { width: size, height: size, className };

  switch (shape) {
    case "rectangle":
      return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="6" width="18" height="12" rx="1" /></svg>;
    case "circle":
      return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" /></svg>;
    case "ellipse":
      return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="9" ry="6" /></svg>;
    case "triangle":
      return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><polygon points="12,4 20,18 4,18" /></svg>;
    case "diamond":
      return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,12 12,22 2,12" /></svg>;
    case "hexagon":
      return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 20,7 20,17 12,22 4,17 4,7" /></svg>;
    case "pentagon":
      return <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,9 18,20 6,20 2,9" /></svg>;
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
  onAddPanel = () => {},
  onExportConfig = () => {},
  onImportConfig = () => {},
  onExportToPNG = () => {},
  onToggleSettings = () => {},
  onClearPanels = () => {},
  onCopy = () => {},
  onPaste = () => {},
  onUndo = () => {},
  onRedo = () => {},
  isEditingCanvas = false,
  canUndo = false,
  canRedo = false,
  canCopy = false,
  canPaste = false,
}: Partial<ToolbarProps>) {
  const { theme, toggleTheme } = useTheme();
  const [selectedShape, setSelectedShape] = useState<PanelShape>("rectangle");
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const isDark = theme === "dark";

  const shapes: PanelShape[] = ["rectangle", "ellipse", "circle", "triangle", "hexagon", "star", "pentagon", "diamond"];

  const handleShapeSelect = (shape: PanelShape) => {
    setSelectedShape(shape);
    setShowShapeDropdown(false);
    onAddPanel(shape);
  };

  return (
    <div className="mb-6">
      <div className={`px-6 py-2 ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
        <h1 className="text-lg font-semibold">Layout Designer</h1>
      </div>
      <div className={`${isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} border-b shadow-sm`}>
        <div className="px-4 py-3">
          <div className="flex gap-8">
            {/* Create Section */}
            <div className="flex flex-col">
              <div className="flex gap-2 mb-2">
                <div className="relative">
                  <button
                    onClick={() => setShowShapeDropdown(!showShapeDropdown)}
                    className={`flex flex-col items-center p-3 rounded-lg ${
                      isDark ? "hover:bg-gray-600 text-green-400" : "hover:bg-gray-100 text-green-600"
                    } transition-colors group border-2 border-dashed ${isDark ? "border-gray-500" : "border-gray-300"}`}
                    title="Add a Shape"
                  >
                    <div className="flex items-center gap-2">
                      <Plus size={20} />
                      <ShapeIcon shape={selectedShape} size={20} />
                    </div>
                    <span className="text-xs mt-1 font-medium">Add a Shape</span>
                  </button>

                  {/* Shape Dropdown */}
                  {showShapeDropdown && (
                    <div
                      className={`absolute top-full left-0 mt-1 p-2 rounded-lg shadow-lg border z-50 ${
                        isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="grid grid-cols-4 gap-2 w-64">
                        {shapes.map((shape) => (
                          <button
                            key={shape}
                            onClick={() => handleShapeSelect(shape)}
                            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                              selectedShape === shape
                                ? isDark
                                  ? "bg-blue-600 text-white"
                                  : "bg-blue-100 text-blue-600"
                                : isDark
                                ? "hover:bg-gray-600 text-gray-300"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                            title={shape.charAt(0).toUpperCase() + shape.slice(1)}
                          >
                            <ShapeIcon shape={shape} size={24} />
                            <span className="text-xs mt-1 font-medium capitalize">{shape}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"} text-center font-medium`}>Create</div>
            </div>

            {/* Separator */}
            <div className={`w-px ${isDark ? "bg-gray-600" : "bg-gray-300"}`}></div>

            {/* File Section */}
            <div className="flex flex-col">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={onExportConfig}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    isDark ? "hover:bg-gray-600 text-blue-400" : "hover:bg-gray-100 text-blue-600"
                  } transition-colors`}
                  title="Save Configuration"
                >
                  <Save size={24} />
                  <span className="text-xs mt-1 font-medium">Save</span>
                </button>
                <label
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    isDark ? "hover:bg-gray-600 text-blue-400" : "hover:bg-gray-100 text-blue-600"
                  } transition-colors cursor-pointer`}
                  title="Import Configuration"
                >
                  <Upload size={24} />
                  <span className="text-xs mt-1 font-medium">Import</span>
                  <input type="file" accept=".json" onChange={onImportConfig} className="hidden" />
                </label>
                <button
                  onClick={onExportToPNG}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    isDark ? "hover:bg-gray-600 text-purple-400" : "hover:bg-gray-100 text-purple-600"
                  } transition-colors`}
                  title="Export to PNG"
                >
                  <Download size={24} />
                  <span className="text-xs mt-1 font-medium">Export</span>
                </button>
              </div>
              <div className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"} text-center font-medium`}>File</div>
            </div>

            {/* Separator */}
            <div className={`w-px ${isDark ? "bg-gray-600" : "bg-gray-300"}`}></div>

            {/* Edit Section */}
            <div className="flex flex-col">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={onCopy}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    canCopy
                      ? isDark
                        ? "hover:bg-gray-600 text-teal-400"
                        : "hover:bg-gray-100 text-teal-600"
                      : "text-gray-400 cursor-not-allowed"
                  } transition-colors`}
                  title="Copy Selected Panel"
                  disabled={!canCopy}
                >
                  <Copy size={24} />
                  <span className="text-xs mt-1 font-medium">Copy</span>
                </button>
                <button
                  onClick={onPaste}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    canPaste
                      ? isDark
                        ? "hover:bg-gray-600 text-teal-400"
                        : "hover:bg-gray-100 text-teal-600"
                      : "text-gray-400 cursor-not-allowed"
                  } transition-colors`}
                  title="Paste Panel"
                  disabled={!canPaste}
                >
                  <ClipboardPaste size={24} />
                  <span className="text-xs mt-1 font-medium">Paste</span>
                </button>
                <button
                  onClick={onUndo}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    canUndo
                      ? isDark
                        ? "hover:bg-gray-600 text-yellow-400"
                        : "hover:bg-gray-100 text-yellow-600"
                      : "text-gray-400 cursor-not-allowed"
                  } transition-colors`}
                  title="Undo"
                  disabled={!canUndo}
                >
                  <Undo size={24} />
                  <span className="text-xs mt-1 font-medium">Undo</span>
                </button>
                <button
                  onClick={onRedo}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    canRedo
                      ? isDark
                        ? "hover:bg-gray-600 text-yellow-400"
                        : "hover:bg-gray-100 text-yellow-600"
                      : "text-gray-400 cursor-not-allowed"
                  } transition-colors`}
                  title="Redo"
                  disabled={!canRedo}
                >
                  <Redo size={24} />
                  <span className="text-xs mt-1 font-medium">Redo</span>
                </button>
                <button
                  onClick={onClearPanels}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    isDark ? "hover:bg-gray-600 text-red-400" : "hover:bg-gray-100 text-red-600"
                  } transition-colors`}
                  title="Clear All Panels"
                >
                  <Trash2 size={24} />
                  <span className="text-xs mt-1 font-medium">Clear</span>
                </button>
              </div>
              <div className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"} text-center font-medium`}>Edit</div>
            </div>

            {/* Separator */}
            <div className={`w-px ${isDark ? "bg-gray-600" : "bg-gray-300"}`}></div>

            {/* View Section */}
            <div className="flex flex-col">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={onToggleSettings}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    isDark ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-100 text-gray-600"
                  } transition-colors ${isEditingCanvas ? "ring-2 ring-blue-500" : ""}`}
                  title="Toggle Settings"
                >
                  <Settings size={24} />
                  <span className="text-xs mt-1 font-medium">Settings</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    isDark ? "hover:bg-gray-600 text-yellow-400" : "hover:bg-gray-100 text-blue-600"
                  } transition-colors`}
                  title={`Switch to ${isDark ? "Light" : "Dark"} Theme`}
                >
                  {isDark ? <Sun size={24} /> : <Moon size={24} />}
                  <span className="text-xs mt-1 font-medium">Theme</span>
                </button>
              </div>
              <div className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"} text-center font-medium`}>View</div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showShapeDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowShapeDropdown(false)} />}
    </div>
  );
}