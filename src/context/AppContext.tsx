// AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AppContextType {
  canvasWidth: number;
  setCanvasWidth: (width: number) => void;
  canvasHeight: number;
  setCanvasHeight: (height: number) => void;
  panels: Panel[];
  setPanels: (panels: Panel[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [panels, setPanelsState] = useState<Panel[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPanels = localStorage.getItem("panels");
    const savedCanvasWidth = localStorage.getItem("canvasWidth");
    const savedCanvasHeight = localStorage.getItem("canvasHeight");

    if (savedPanels) setPanelsState(JSON.parse(savedPanels));
    if (savedCanvasWidth) setCanvasWidth(parseInt(savedCanvasWidth));
    if (savedCanvasHeight) setCanvasHeight(parseInt(savedCanvasHeight));
  }, []);

  // // Save to localStorage when panels/canvas changes
  // useEffect(() => {
  //   localStorage.setItem("panels", JSON.stringify(panels));
  // }, [panels]);

  // useEffect(() => {
  //   localStorage.setItem("canvasWidth", canvasWidth.toString());
  // }, [canvasWidth]);

  // useEffect(() => {
  //   localStorage.setItem("canvasHeight", canvasHeight.toString());
  // }, [canvasHeight]);

  const setPanels = (newPanels: Panel[]) => {
    setPanelsState(newPanels);
  };

  return (
    <AppContext.Provider value={{ canvasWidth, setCanvasWidth, canvasHeight, setCanvasHeight, panels, setPanels }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
