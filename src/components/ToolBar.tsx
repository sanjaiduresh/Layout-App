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
  Settings,
  Palette,
  Grid3X3,
} from "lucide-react";
import { useState } from "react";

type PanelShape =
  | "rectangle"
  | "ellipse"
  | "circle"
  | "triangle"
  | "hexagon"
  | "star"
  | "pentagon"
  | "diamond";

type RibbonTab = "home" | "insert" | "design" | "view";

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
  // Mock theme context for demo
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const [activeTab, setActiveTab] = useState<RibbonTab>("home");
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

  const tabs = [
    { id: "home" as RibbonTab, label: "Home", icon: null },
    { id: "insert" as RibbonTab, label: "Insert", icon: Plus },
    { id: "design" as RibbonTab, label: "Design", icon: Palette },
    { id: "view" as RibbonTab, label: "View", icon: Settings },
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

  const RibbonButton = ({ 
    onClick, 
    icon: Icon, 
    label, 
    disabled = false, 
    className = "",
    size = "default"
  }: {
    onClick: () => void;
    icon: any;
    label: string;
    disabled?: boolean;
    className?: string;
    size?: "small" | "default" | "large";
  }) => {
    const sizeClasses = {
      small: "px-2 py-1.5",
      default: "px-3 py-2",
      large: "px-4 py-2.5"
    };
    
    const iconSizes = {
      small: 16,
      default: 20,
      large: 24
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center ${sizeClasses[size]} rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105 ${
          disabled
            ? "text-gray-400 cursor-not-allowed"
            : isDark
            ? "text-blue-300 hover:bg-blue-900/50"
            : "text-blue-600 hover:bg-blue-100"
        } ${className}`}
        title={label}
      >
        <Icon size={iconSizes[size]} />
        <span className="text-xs font-medium mt-1">{label}</span>
      </button>
    );
  };

  const renderHomeTab = () => (
    <div className="flex items-center gap-6 flex-wrap">
      {/* Clipboard Group */}
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          <RibbonButton
            onClick={onCopy}
            icon={Copy}
            label="Copy"
            disabled={!canCopy}
            size="small"
          />
          <RibbonButton
            onClick={onPaste}
            icon={ClipboardPaste}
            label="Paste"
            disabled={!canPaste}
            size="small"
          />
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          Clipboard
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* File Group */}
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          <RibbonButton onClick={onExportConfig} icon={Save} label="Save" />
          <label className={`flex flex-col items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm hover:scale-105 ${
            isDark ? "text-blue-300 hover:bg-blue-900/50" : "text-blue-600 hover:bg-blue-100"
          }`}>
            <Upload size={20} />
            <span className="text-xs font-medium mt-1">Open</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportConfig}
              className="hidden"
            />
          </label>
          <RibbonButton
            onClick={onExportToPNG}
            icon={Download}
            label="Export"
            className={isDark ? "text-purple-300 hover:bg-purple-900/50" : "text-purple-600 hover:bg-purple-100"}
          />
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          File
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* History Group */}
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          <RibbonButton
            onClick={onUndo}
            icon={Undo}
            label="Undo"
            disabled={!canUndo}
            className={isDark ? "text-yellow-300 hover:bg-yellow-900/50" : "text-yellow-600 hover:bg-yellow-100"}
          />
          <RibbonButton
            onClick={onRedo}
            icon={Redo}
            label="Redo"
            disabled={!canRedo}
            className={isDark ? "text-yellow-300 hover:bg-yellow-900/50" : "text-yellow-600 hover:bg-yellow-100"}
          />
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          History
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* Actions Group */}
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          <RibbonButton
            onClick={onClearPanels}
            icon={Trash2}
            label="Clear All"
            className={isDark ? "text-red-300 hover:bg-red-900/50" : "text-red-600 hover:bg-red-100"}
          />
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          Actions
        </div>
      </div>
    </div>
  );

  const renderInsertTab = () => (
    <div className="flex items-center gap-6 flex-wrap">
      {/* Panels Group */}
      <div className="flex flex-col">
        <div className="relative mb-2">
          <button
            onClick={() => setShowShapeDropdown(!showShapeDropdown)}
            className={`flex flex-col items-center px-6 py-3 rounded-lg border-2 border-dashed transition-all duration-200 hover:shadow-sm hover:scale-105 ${
              isDark
                ? "text-blue-300 hover:bg-blue-900/50 border-gray-600"
                : "text-blue-600 hover:bg-blue-100 border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus size={28} />
              <ShapeIcon shape={selectedShape} size={28} />
            </div>
            <span className="text-sm font-medium mt-2">Add Panel</span>
          </button>
          {showShapeDropdown && (
            <div className={`absolute top-full left-0 mt-2 p-4 rounded-lg shadow-xl border z-50 ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <div className="grid grid-cols-4 gap-3 w-80">
                {shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => handleShapeSelect(shape)}
                    className={`flex flex-col items-center px-3 py-3 rounded-md transition-all duration-200 ${
                      selectedShape === shape
                        ? isDark ? "bg-blue-700 text-white" : "bg-blue-200 text-blue-700"
                        : isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <ShapeIcon shape={shape} size={32} />
                    <span className="text-xs font-medium capitalize mt-2">{shape}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          Panels
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* Quick Shapes Group */}
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          {["rectangle", "circle", "triangle", "star"].map((shape) => (
            <button
              key={shape}
              onClick={() => onAddPanel(shape as PanelShape)}
              className={`flex flex-col items-center px-2 py-2 rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105 ${
                isDark ? "text-blue-300 hover:bg-blue-900/50" : "text-blue-600 hover:bg-blue-100"
              }`}
              title={`Add ${shape}`}
            >
              <ShapeIcon shape={shape as PanelShape} size={20} />
              <span className="text-xs font-medium mt-1 capitalize">{shape}</span>
            </button>
          ))}
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          Quick Shapes
        </div>
      </div>
    </div>
  );

  const renderDesignTab = () => (
    <div className="flex items-center gap-6 flex-wrap">
      {/* Colors Group */}
      <div className="flex flex-col">
        <div className="flex gap-4 mb-2 items-center">
          <div className="flex flex-col items-center">
            <input
              type="color"
              value={canvasBgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all duration-200"
            />
            <span className="text-xs font-medium mt-1">Background</span>
          </div>
          <div className="flex flex-col items-center">
            <input
              type="color"
              value={canvasFgColor}
              onChange={(e) => onFgColorChange(e.target.value)}
              className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all duration-200"
            />
            <span className="text-xs font-medium mt-1">Foreground</span>
          </div>
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          Colors
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* Canvas Size Group */}
      <div className="flex flex-col">
        <div className="flex gap-2 mb-2 items-center">
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Width</label>
            <input
              type="number"
              value={widthInput}
              onChange={(e) => setWidthInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-20 h-8 text-sm font-mono rounded-md border ${
                isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"
              } px-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
              min="200"
              max="1200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Height</label>
            <input
              type="number"
              value={heightInput}
              onChange={(e) => setHeightInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-20 h-8 text-sm font-mono rounded-md border ${
                isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"
              } px-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
              min="200"
              max="1200"
            />
          </div>
          <button
            onClick={handleDimensionSubmit}
            className={`px-3 py-1 mt-4 text-xs rounded-md transition-colors ${
              isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Apply
          </button>
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          Canvas Size
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* Style Group */}
      <div className="flex flex-col">
        <div className="flex gap-2 mb-2 items-center">
          <div className="flex flex-col items-center">
            <button
              onClick={onRoundedCornersToggle}
              className={`relative inline-flex h-6 w-11 rounded-full transition-all duration-200 ${
                roundedCorners
                  ? isDark ? "bg-blue-500" : "bg-blue-400"
                  : isDark ? "bg-gray-600" : "bg-gray-200"
              } hover:ring-2 hover:ring-blue-300`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  roundedCorners ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-xs font-medium mt-1">Rounded</span>
          </div>
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          Style
        </div>
      </div>
    </div>
  );

  const renderViewTab = () => (
    <div className="flex items-center gap-6 flex-wrap">
      {/* Theme Group */}
      <div className="flex flex-col">
        <div className="flex gap-1 mb-2">
          <RibbonButton
            onClick={toggleTheme}
            icon={isDark ? Sun : Moon}
            label={`${isDark ? "Light" : "Dark"} Mode`}
            size="large"
          />
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          Theme
        </div>
      </div>

      {/* Separator */}
      <div className={`h-16 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* Display Group */}
      <div className="flex flex-col">
        <div className="flex gap-2 mb-2 items-center">
          <div className="flex flex-col items-center">
            <button
              onClick={onShowGridToggle}
              className={`relative inline-flex h-6 w-11 rounded-full transition-all duration-200 ${
                showGrid
                  ? isDark ? "bg-blue-500" : "bg-blue-400"
                  : isDark ? "bg-gray-600" : "bg-gray-200"
              } hover:ring-2 hover:ring-blue-300`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  showGrid ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-xs font-medium mt-1">Grid</span>
          </div>
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-700"} text-center`}>
          Display
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return renderHomeTab();
      case "insert":
        return renderInsertTab();
      case "design":
        return renderDesignTab();
      case "view":
        return renderViewTab();
      default:
        return renderHomeTab();
    }
  };

  return (
    <div className="mb-4 font-sans">
      {/* Ribbon Container */}
      <div className={`${isDark ? "bg-gray-900" : "bg-white"} border-b border-gray-200 shadow-lg`}>
        {/* Tab Navigation */}
        <div className={`${isDark ? "bg-gray-800" : "bg-gray-50"} border-b border-gray-200`}>
          <div className="px-6">
            <div className="flex space-x-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? isDark
                        ? "border-blue-400 text-blue-300 bg-gray-900"
                        : "border-blue-500 text-blue-600 bg-white"
                      : isDark
                      ? "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {tab.icon && <tab.icon size={16} />}
                    {tab.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-4">
          {renderTabContent()}
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