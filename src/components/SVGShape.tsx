import React from "react";
import { PanelShape } from "../types/canvas";

interface SVGShapeProps {
  shape: PanelShape;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth?: number;
}

const SVGShape: React.FC<SVGShapeProps> = ({ 
  shape, 
  width, 
  height, 
  fillColor, 
  strokeColor, 
  strokeWidth = 2 
}) => {
  const renderShape = () => {
    switch (shape) {
      case "triangle":
        return (
          <polygon
            points={`${width / 2},${strokeWidth} ${strokeWidth},${
              height - strokeWidth
            } ${width - strokeWidth},${height - strokeWidth}`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        );
      
      case "hexagon":
        const hexPoints = [
          [width * 0.25, strokeWidth],
          [width * 0.75, strokeWidth],
          [width - strokeWidth, height * 0.5],
          [width * 0.75, height - strokeWidth],
          [width * 0.25, height - strokeWidth],
          [strokeWidth, height * 0.5],
        ];
        return (
          <polygon
            points={hexPoints.map((p) => p.join(",")).join(" ")}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        );
      
      case "pentagon":
        const pentPoints = [
          [width / 2, strokeWidth],
          [width - strokeWidth, height * 0.38],
          [width * 0.82, height - strokeWidth],
          [width * 0.18, height - strokeWidth],
          [strokeWidth, height * 0.38],
        ];
        return (
          <polygon
            points={pentPoints.map((p) => p.join(",")).join(" ")}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        );
      
      case "diamond":
        return (
          <polygon
            points={`${width / 2},${strokeWidth} ${width - strokeWidth},${
              height / 2
            } ${width / 2},${height - strokeWidth} ${strokeWidth},${
              height / 2
            }`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        );
      
      case "star":
        const cx = width / 2;
        const cy = height / 2;
        const outerRadius = Math.min(width, height) / 2 - strokeWidth;
        const innerRadius = outerRadius * 0.4;
        const points = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          points.push(`${x},${y}`);
        }
        return (
          <polygon
            points={points.join(" ")}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <svg width={width} height={height} className="absolute inset-0">
      {renderShape()}
    </svg>
  );
};

export default SVGShape;