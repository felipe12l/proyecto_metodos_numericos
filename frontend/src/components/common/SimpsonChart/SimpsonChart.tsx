// src/components/common/SimpsonChart/SimpsonChart.tsx

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
import './SimpsonChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);

interface Point {
  x: number;
  y: number;
}

interface Props {
  funcPlot: Point[];          // curva suave
  puntosSimpson: Point[];     // nodos reales
}

export default function SimpsonChart({ funcPlot, puntosSimpson }: Props) {
  // Si no hay datos, devolvemos mensaje
  if (!funcPlot.length) {
    return <p>No hay datos para graficar.</p>;
  }

  // Labels: simplemente los valores de x (todos) de funcPlot
  const labels = funcPlot.map((p) => p.x);

  // 1) Dataset para curva continua de f(x)
  const datasetCurva = {
    label: 'f(x)',
    data: funcPlot.map((p) => p.y),
    fill: false,
    borderColor: 'rgba(53, 162, 235, 1)',  // azul
    backgroundColor: 'rgba(53, 162, 235, 1)',
    borderWidth: 2,
    pointRadius: 0,   // Ocultar puntos en la curva suave
    tension: 0.2      // suavizado ligero
  };

  // 2) Dataset para puntos de Simpson: 
  //    Debemos alinear cada punto con la misma posición de x en labels.
  //    Pero Chart.js permite pasar un arreglo de objetos {x,y} y tipo='scatter'.
  const datasetNodos = {
    label: 'Nodos Simpson',
    data: puntosSimpson.map((p) => ({ x: p.x, y: p.y })),
    fill: false,
    showLine: false,
    pointRadius: 5,
    pointBackgroundColor: '#e91e63',
    pointBorderColor: '#ff5722',
    pointBorderWidth: 1.5
  };

  const chartData: ChartData<'line'> = {
    labels, 
    datasets: [
      {
        ...datasetCurva,
        parsing: { xAxisKey: 'x', yAxisKey: 'y' }
      },
      {
        ...datasetNodos,
        parsing: { xAxisKey: 'x', yAxisKey: 'y' }
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'x',
          font: { size: 14 },
          color: '#333'
        }
      },
      y: {
        title: {
          display: true,
          text: 'f(x)',
          font: { size: 14 },
          color: '#333'
        }
      }
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'nearest', intersect: false },
      zoom: {
        pan: { enabled: true, mode: 'xy' },
        zoom: { wheel: { enabled: true }, mode: 'xy' }
      }
    }
  };

  return (
    <div className="simpson-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}
