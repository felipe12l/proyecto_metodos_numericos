import React, { useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Customized,
} from "recharts";
import { parseLatex } from "../../../utils/parseLatex"; // Asegúrate de tener bien el path

type Point = { x: number; y: number };

interface Props {
  expression: string; // La expresión en LaTeX, como "x^2 + \\sin(x)"
  trapPoints: Point[];
  range: { start: number; end: number; step: number };
}

const TrapecioGraph: React.FC<Props> = ({ expression, trapPoints, range }) => {
  const [hoveredArea, setHoveredArea] = useState<number | null>(null);

  // Convierte la expresión LaTeX a código JavaScript válido
  const parsedExpression = parseLatex(expression, "js");

  let f: (x: number) => number;
  try {
    f = new Function("x", `return ${parsedExpression}`) as (x: number) => number;
  } catch (error) {
    console.error("Error creando la función:", error);
    f = () => NaN;
  }

  const functionData = [];
  for (let x = range.start; x <= range.end; x += range.step) {
    const y = f(x);
    functionData.push({ x, y });
  }

  // Agrupar los trapecios de 4 en 4
  const trapezoids: { id: number; points: Point[]; area: number; color: string }[] = [];
  for (let i = 0; i < trapPoints.length; i += 4) {
    const pts = trapPoints.slice(i, i + 4);
    if (pts.length === 4) {
      const base1 = Math.abs(pts[0].y - pts[1].y);
      const base2 = Math.abs(pts[2].y - pts[3].y);
      const height = Math.abs(pts[0].x - pts[3].x);
      const area = ((base1 + base2) * height) / 2;
      const color = `rgba(${(i * 60) % 255}, ${(i * 80) % 255}, ${(i * 100) % 255}, 0.5)`;
      trapezoids.push({ id: i / 4, points: pts, area, color });
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={functionData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="x" type="number" />
          <YAxis />
          <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} strokeWidth={2} />
          <Customized
            component={({ xAxisMap, yAxisMap }: any) => {
              const xScale = xAxisMap[0].scale;
              const yScale = yAxisMap[0].scale;
              return (
                <>
                  {trapezoids.map((trap, index) => (
                    <g
                      key={index}
                      onMouseEnter={() => setHoveredArea(index)}
                      onMouseLeave={() => setHoveredArea(null)}
                    >
                      <polygon
                        points={trap.points
                          .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
                          .join(" ")}
                        fill={trap.color}
                        stroke="#222"
                        strokeWidth={1}
                      />
                      {hoveredArea === index && (
                        <text
                          x={(xScale(trap.points[0].x) + xScale(trap.points[2].x)) / 2}
                          y={Math.min(...trap.points.map((p) => yScale(p.y))) - 10}
                          textAnchor="middle"
                          fill="#000"
                          fontSize={12}
                          fontWeight="bold"
                        >
                          Área: {trap.area.toFixed(4)}
                        </text>
                      )}
                    </g>
                  ))}
                </>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrapecioGraph;
