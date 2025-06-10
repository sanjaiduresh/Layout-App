import { useReducer } from 'react';
import { CanvasConfig, Panel, CanvasState } from '../types/canvas';

// Canvas Action Types
type CanvasAction =
  | { type: "SET_PANELS"; payload: Panel[] }
  | { type: "ADD_PANEL"; payload: Panel }
  | { type: "REMOVE_PANEL"; payload: string }
  | { type: "UPDATE_PANEL"; payload: { id: string; updates: Partial<Panel> } }
  | { type: "UPDATE_PANEL_POSITION"; payload: { id: string; x: number; y: number } }
  | { type: "UPDATE_PANEL_DIMENSIONS"; payload: { id: string; width: number; height: number } }
  | { type: "CLEAR_PANELS" }
  | { type: "SET_SELECTED_PANEL"; payload: string | null }
  | { type: "SET_CANVAS_DIMENSIONS"; payload: { width: number; height: number } }
  | { type: "SET_CANVAS_COLORS"; payload: { bgColor?: string; fgColor?: string } }
  | { type: "SET_CANVAS_OPTIONS"; payload: { roundedCorners?: boolean; showGrid?: boolean } }
  | { type: "SET_EDITING_STATES"; payload: { editingPanel?: string | null; isEditingCanvas?: boolean } }
  | { type: "LOAD_CONFIG"; payload: CanvasConfig }
  | { type: "UNDO" }
  | { type: "REDO" };

// Extended Canvas State with History
interface ExtendedCanvasState extends CanvasState {
  past: CanvasState[];
  future: CanvasState[];
}

// Initial State
const initialState: ExtendedCanvasState = {
  panels: [],
  selectedPanel: null,
  editingPanel: null,
  canvasWidth: 1180,
  canvasHeight: 720,
  canvasBgColor: "#ffffff",
  canvasFgColor: "#000000",
  roundedCorners: true,
  showGrid: false,
  isEditingCanvas: false,
  past: [],
  future: [],
};

// Panel Validation
const validateAndAdjustPanels = (
  panels: Panel[],
  canvasWidth: number,
  canvasHeight: number
): Panel[] => {
  return panels
    .filter(
      (panel) =>
        panel.id &&
        typeof panel.x === "number" &&
        !isNaN(panel.x) &&
        typeof panel.y === "number" &&
        !isNaN(panel.y) &&
        typeof panel.width === "number" &&
        !isNaN(panel.width) &&
        panel.width >= 50 &&
        typeof panel.height === "number" &&
        !isNaN(panel.height) &&
        panel.height >= 50 &&
        typeof panel.zIndex === "number" &&
        !isNaN(panel.zIndex) &&
        [
          "rectangle",
          "circle",
          "ellipse",
          "triangle",
          "hexagon",
          "pentagon",
          "star",
          "diamond",
        ].includes(panel.shape)
    )
    .map((panel) => ({
      ...panel,
      x: Math.max(0, Math.min(panel.x, canvasWidth - panel.width)),
      y: Math.max(0, Math.min(panel.y, canvasHeight - panel.height)),
    }));
};

// Save current state to history
const saveStateToHistory = (state: ExtendedCanvasState, newState: ExtendedCanvasState): ExtendedCanvasState => ({
  ...newState,
  past: [
    {
      ...state,
      past: [],
      future: [],
    },
    ...state.past.slice(0, 50), // Limit history to 50 steps
  ],
  future: [], // Clear future on new action
});

// Reducer Function
const canvasReducer = (
  state: ExtendedCanvasState,
  action: CanvasAction
): ExtendedCanvasState => {
  switch (action.type) {
    case "SET_PANELS":
      return saveStateToHistory(state, {
        ...state,
        panels: action.payload,
      });
    case "ADD_PANEL":
      return saveStateToHistory(state, {
        ...state,
        panels: [...state.panels, action.payload],
      });
    case "REMOVE_PANEL":
      return saveStateToHistory(state, {
        ...state,
        panels: state.panels.filter((panel) => panel.id !== action.payload),
        selectedPanel: state.selectedPanel === action.payload ? null : state.selectedPanel,
      });
    case "UPDATE_PANEL":
      return saveStateToHistory(state, {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === action.payload.id ? { ...panel, ...action.payload.updates } : panel
        ),
      });
    case "UPDATE_PANEL_POSITION":
      return saveStateToHistory(state, {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === action.payload.id
            ? {
                ...panel,
                x: Math.max(0, Math.min(action.payload.x, state.canvasWidth - panel.width)),
                y: Math.max(0, Math.min(action.payload.y, state.canvasHeight - panel.height)),
              }
            : panel
        ),
      });
    case "UPDATE_PANEL_DIMENSIONS":
      return saveStateToHistory(state, {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === action.payload.id
            ? { ...panel, width: action.payload.width, height: action.payload.height }
            : panel
        ),
      });
    case "CLEAR_PANELS":
      return saveStateToHistory(state, {
        ...state,
        panels: [],
        selectedPanel: null,
      });
    case "SET_SELECTED_PANEL":
      return { ...state, selectedPanel: action.payload };
    case "SET_CANVAS_DIMENSIONS":
      return saveStateToHistory(state, {
        ...state,
        canvasWidth: action.payload.width,
        canvasHeight: action.payload.height,
        panels: validateAndAdjustPanels(state.panels, action.payload.width, action.payload.height),
      });
    case "SET_CANVAS_COLORS":
      return saveStateToHistory(state, {
        ...state,
        ...(action.payload.bgColor && { canvasBgColor: action.payload.bgColor }),
        ...(action.payload.fgColor && { canvasFgColor: action.payload.fgColor }),
      });
    case "SET_CANVAS_OPTIONS":
      return saveStateToHistory(state, {
        ...state,
        ...(action.payload.roundedCorners !== undefined && { roundedCorners: action.payload.roundedCorners }),
        ...(action.payload.showGrid !== undefined && { showGrid: action.payload.showGrid }),
      });
    case "SET_EDITING_STATES":
      return {
        ...state,
        ...(action.payload.editingPanel !== undefined && { editingPanel: action.payload.editingPanel }),
        ...(action.payload.isEditingCanvas !== undefined && { isEditingCanvas: action.payload.isEditingCanvas }),
      };
    case "LOAD_CONFIG":
      const validatedPanels = validateAndAdjustPanels(
        action.payload.panels || [],
        action.payload.canvasWidth || 1280,
        action.payload.canvasHeight || 720
      );
      return saveStateToHistory(state, {
        ...state,
        panels: validatedPanels,
        canvasWidth: action.payload.canvasWidth || 1280,
        canvasHeight: action.payload.canvasHeight || 720,
        canvasBgColor: action.payload.canvasBgColor || "#ffffff",
        canvasFgColor: action.payload.canvasFgColor || "#000000",
        roundedCorners: action.payload.roundedCorners !== undefined ? action.payload.roundedCorners : true,
        showGrid: action.payload.showGrid || false,
      });
    case "UNDO":
      if (state.past.length === 0) return state;
      const previous = state.past[0];
      return {
        ...previous,
        past: state.past.slice(1),
        future: [
          {
            ...state,
            past: [],
            future: [],
          },
          ...state.future,
        ],
      };
    case "REDO":
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        ...next,
        past: [
          {
            ...state,
            past: [],
            future: [],
          },
          ...state.past,
        ],
        future: state.future.slice(1),
      };
    default:
      return state;
  }
};

// Custom Hook
export const useCanvasState = () => {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  // Action creators for easier usage
  const actions = {
    setPanels: (panels: Panel[]) => dispatch({ type: "SET_PANELS", payload: panels }),
    addPanel: (panel: Panel) => dispatch({ type: "ADD_PANEL", payload: panel }),
    removePanel: (id: string) => dispatch({ type: "REMOVE_PANEL", payload: id }),
    updatePanel: (id: string, updates: Partial<Panel>) =>
      dispatch({ type: "UPDATE_PANEL", payload: { id, updates } }),
    updatePanelPosition: (id: string, x: number, y: number) =>
      dispatch({ type: "UPDATE_PANEL_POSITION", payload: { id, x, y } }),
    updatePanelDimensions: (id: string, width: number, height: number) =>
      dispatch({ type: "UPDATE_PANEL_DIMENSIONS", payload: { id, width, height } }),
    clearPanels: () => dispatch({ type: "CLEAR_PANELS" }),
    setSelectedPanel: (id: string | null) => dispatch({ type: "SET_SELECTED_PANEL", payload: id }),
    setCanvasDimensions: (width: number, height: number) =>
      dispatch({ type: "SET_CANVAS_DIMENSIONS", payload: { width, height } }),
    setCanvasColors: (bgColor?: string, fgColor?: string) =>
      dispatch({ type: "SET_CANVAS_COLORS", payload: { bgColor, fgColor } }),
    setCanvasOptions: (roundedCorners?: boolean, showGrid?: boolean) =>
      dispatch({ type: "SET_CANVAS_OPTIONS", payload: { roundedCorners, showGrid } }),
    setEditingStates: (editingPanel?: string | null, isEditingCanvas?: boolean) =>
      dispatch({ type: "SET_EDITING_STATES", payload: { editingPanel, isEditingCanvas } }),
    loadConfig: (config: CanvasConfig) => dispatch({ type: "LOAD_CONFIG", payload: config }),
    undo: () => dispatch({ type: "UNDO" }),
    redo: () => dispatch({ type: "REDO" }),
  };

  return {
    state,
    actions,
    dispatch,
  };
};

// Export types for use in other files
export type { CanvasAction };
export default canvasReducer;