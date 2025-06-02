// frontend/src/components/ChartWithZoom/ChartWithZoomMulti.tsx

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import './ChartWithZoom.css'; // Reutiliza estilos de ChartWithZoom

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);

interface Point { x: number; y: number }
interface SingleDataset {
  name: string;
  points: Point[];
}
interface Props {
  datasets: SingleDataset[];
}

/**
 * Este componente dibuja múltiples líneas/puntos:
 * - Cada elemento en `datasets` aparece como una serie independiente en un mismo chart.
 * - `name` será la etiqueta (legend) y `points` es el array de {x,y}.
 */
export default function ChartWithZoomMulti({ datasets }: Props) {
  // 1) Reunir todas las “x” de todos los datasets para tener el set de labels:
  const allXs = Array.from(
    new Set(datasets.flatMap(ds => ds.points.map(p => p.x)))
  );
  // Ordenamos las etiquetas numéricamente:
  allXs.sort((a, b) => a - b);

  // 2) Para cada dataset, creamos un arreglo de Y que corresponda a `allXs`.
  //    Si no existe valor para alguna X en el dataset, podemos poner `null` para que Chart.js
  //    no dibuje un punto (o lo interpole).
  const chartDatasets = datasets.map((ds, idx) => {
    // Mapeo de X→Y para este dataset:
    const mapXtoY = new Map<number, number>();
    ds.points.forEach((p) => mapXtoY.set(p.x, p.y));

    // Arreglo de valores y en el orden de allXs:
    const dataYs = allXs.map((xval) => {
      const y = mapXtoY.get(xval);
      return y !== undefined ? y : null;
    });

    // Asignamos colores distintos según índice (puedes personalizar):
    const colors = [
      'rgba(75, 192, 192, 1)',
      'rgba(255, 99, 132, 1)',
      'rgba(53, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(153, 102, 255, 1)'
    ];
    const pointStyles = datasets.length > 2
      ? datasets.map((_, i) => (i === idx ? 'circle' : 'dash')) // ejemplo simple
      : ['circle', 'triangle', 'rect'];

    return {
      label: ds.name,
      data: dataYs,
      fill: false,
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length],
      pointRadius: ds.name === 'Iteraciones' ? 5 : 0,  // Solo dibujamos puntos grandes para iteraciones
      pointStyle: ds.name === 'Iteraciones' ? 'circle' : 'line',
      showLine: ds.name !== 'Iteraciones',            // Para iteraciones mostrarlos como puntos, no línea
      borderWidth: 2,
      spanGaps: true, // Para no unir los null continuity
    };
  });

  const chartData: ChartData<'line'> = {
    labels: allXs,
    datasets: chartDatasets as any
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: { display: true, text: 'x' },
      },
      y: {
        title: { display: true, text: 'y' },
      },
    },
    plugins: {
      tooltip: { mode: 'nearest', intersect: false },
      legend: { position: 'top' },
      zoom: {
        pan: { enabled: true, mode: 'xy' },
        zoom: { wheel: { enabled: true }, mode: 'xy' }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}
