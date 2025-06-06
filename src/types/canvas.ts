export type PanelShape = "rectangle" | "circle" | "ellipse" | "triangle" | "hexagon" | "pentagon" | "star" | "diamond";



export interface Panel {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  shape: PanelShape; // Add more shapes as needed
}

export interface CanvasConfig {
  panels: Panel[];
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasFgColor: string;
  roundedCorners: boolean;
  showGrid: boolean;
}

export interface ResizeState {
  id: string;
  corner: string;
}

export interface ResizeStartPos {
  x: number;
  y: number;
  width: number;
  height: number;
  panelX: number;
  panelY: number;
}

export interface ResizingPanel{
   id: string;
    corner: string;
}

export interface CanvasState {
  panels: Panel[];
  selectedPanel: string | null;
  editingPanel: string | null;
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasFgColor: string;
  roundedCorners: boolean;
  showGrid: boolean;
  isEditingCanvas: boolean;
  past: CanvasState[];
  future: CanvasState[];
}

