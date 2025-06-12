import { Panel } from "../types/canvas";
import { X } from "lucide-react";

interface EditPanelPopupProps {
  panel: Panel;
  theme: string;
  onTitleChange: (id: string, title: string) => void;
  onDimensionChange: (id: string, updates: Partial<Panel>) => void;
  onClose: () => void;
  onBringForward: (id: string) => void;
  onBringBackward: (id: string) => void;
}

export default function EditPanelPopup({
  panel,
  theme,
  onTitleChange,
  onDimensionChange,
  onClose,
  onBringForward,
  onBringBackward,
}: EditPanelPopupProps) {
  return (
    <div className="fixed top-0 right-0 h-screen w-[300px] z-30">
      <div className={`bg-white dark:bg-gray-800 shadow-2xl border-l ${
        theme === "dark" ? "border-gray-600" : "border-gray-200"
      } h-full overflow-y-auto flex flex-col`}>
        <div className={`px-4 py-3 border-b ${
          theme === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"
        } flex items-center justify-between`}>
          <h3 className={`font-semibold text-sm ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            Edit Panel
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <div className={`p-4 space-y-4 flex-1 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}>
              Panel Title
            </label>
            <input
              type="text"
              value={panel.title || ""}
              onChange={(e) => onTitleChange(panel.id, e.target.value)}
              placeholder="Enter panel title..."
              className={`w-full h-10 text-sm rounded-lg px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                  : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs mb-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  Width (px)
                </label>
                <input
                  type="number"
                  value={panel.width}
                  onChange={(e) => onDimensionChange(panel.id, { width: parseInt(e.target.value) || 50 })}
                  className={`w-full h-9 text-sm rounded-md px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                  min="50"
                  max="800"
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  Height (px)
                </label>
                <input
                  type="number"
                  value={panel.height}
                  onChange={(e) => onDimensionChange(panel.id, { height: parseInt(e.target.value) || 50 })}
                  className={`w-full h-9 text-sm rounded-md px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  } ${panel.shape === "circle" ? "opacity-50 cursor-not-allowed" : ""}`}
                  min="50"
                  max="800"
                  disabled={panel.shape === "circle"}
                />
              </div>
            </div>
            {panel.shape === "circle" && (
              <p className={`text-xs mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                Height is locked for circle shapes
              </p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}>
              Shape Colors
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs mb-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  Fill Color
                </label>
                <input
                  type="color"
                  value={panel.fillColor || "#ffffff"}
                  onChange={(e) => onDimensionChange(panel.id, { fillColor: e.target.value })}
                  className={`w-full h-9 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } cursor-pointer`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  Border Color
                </label>
                <input
                  type="color"
                  value={panel.borderColor || "#d1d5db"}
                  onChange={(e) => onDimensionChange(panel.id, { borderColor: e.target.value })}
                  className={`w-full h-9 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } cursor-pointer`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}>
              Layer Order
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onBringForward(panel.id)}
                className={`p-2 rounded-md text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Bring Forward
              </button>
              <button
                onClick={() => onBringBackward(panel.id)}
                className={`p-2 rounded-md text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Bring Backward
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}