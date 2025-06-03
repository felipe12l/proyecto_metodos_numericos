// src/components/common/ConvergenceChart/ConvergenceChart.tsx

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
import './ConvergenceChart.css';

// Registramos los componentes y el plugin de zoom
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);

interface Props {
  historial: number[][];
  // historial[k] = vector [ x1^(k), x2^(k), …, xn^(k) ]
}

export default function ConvergenceChart({ historial }: Props) {
  if (!historial || historial.length === 0) {
    return <p>No hay datos de convergencia para graficar.</p>;
  }

  // Cada fila historial[k] tiene la lista de valores para x1,x2,… en la iteración k.
  const numIter = historial.length;          // numero total de pasos (0..N)
  const nVars   = historial[0].length;       // cantidad de incógnitas (n)

  // 1) Etiquetas en el eje X: [0, 1, 2, …, numIter-1]
  const labels = Array.from({ length: numIter }, (_, k) => k);

  // 2) Para cada variable xi (i=0..nVars-1), extraemos su serie a través de todas las iteraciones:
  //    series[i] = [ historial[0][i], historial[1][i], …, historial[N][i] ]
  const series: number[][] = Array.from({ length: nVars }, (_, i) =>
    historial.map((vec) => vec[i])
  );

  // 3) Construimos datasets para Chart.js: un dataset por variable xi
  const palette = [
    'rgba(75, 192, 192, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(53, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(100, 149, 237, 1)',
    'rgba(60, 179, 113, 1)'
  ];

  const datasets = series.map((dataYs, idx) => ({
    label: `x${idx + 1}`,        // “x1”, “x2”, etc.
    data: dataYs,
    fill: false,
    borderColor: palette[idx % palette.length],
    backgroundColor: palette[idx % palette.length],
    pointRadius: 3,
    borderWidth: 2,
    spanGaps: false
  }));

  const chartData: ChartData<'line'> = {
    labels,
    datasets: datasets as any
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Iteración (k)',
          font: { size: 14 },
          color: '#333'
        },
        ticks: { stepSize: 1 }
      },
      y: {
        title: {
          display: true,
          text: 'Valor de xᵢ',
          font: { size: 14 },
          color: '#333'
        }
      }
    },
    plugins: {
      legend: { position: 'top' },
      zoom: {
        pan: { enabled: true, mode: 'xy' },
        zoom: { wheel: { enabled: true }, mode: 'xy' }
      }
    }
  };

  return (
    <div className="convergence-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}
