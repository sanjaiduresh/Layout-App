import { Panel } from '../types/canvas';

export const validateAndAdjustPanels = (
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
        !isNaN(panel.zIndex)
    )
    .map((panel) => ({
      ...panel,
      x: Math.max(0, Math.min(panel.x, canvasWidth - panel.width)), // Keep within canvas width
      y: Math.max(0, Math.min(panel.y, canvasHeight - panel.height)), // Keep within canvas height
    }));
};