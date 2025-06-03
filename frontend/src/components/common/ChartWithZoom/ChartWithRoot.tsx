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
import './ChartWithZoom.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);

interface Point { x: number; y: number; special?: boolean }
interface Props { data: Point[] }

export default function ChartWithRoot({ data }: Props) {
  const functionPoints = data.filter(p => !p.special);
  const rootPoints = data.filter(p => p.special);

  const chartData: ChartData<'line'> = {
    labels: functionPoints.map(p => p.x),
    datasets: [
      {
        label: 'f(x)',
        data: functionPoints.map(p => ({ x: p.x, y: p.y })),
        fill: false,
        borderColor: 'var(--chart-line-color)',
        backgroundColor: 'var(--chart-fill-color)',
        borderWidth: 2,
        pointRadius: 2,
        showLine: true,
        spanGaps: true,
      },
      {
        label: 'Raíz',
        data: rootPoints.map(p => ({ x: p.x, y: p.y })),
        fill: false,
        showLine: false,
        pointRadius: 8,
        pointBackgroundColor: 'red',
        pointBorderColor: 'black',
        pointBorderWidth: 2,
        spanGaps: true,
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
        title: { display: true, text: 'x' },
      },
      y: {
        title: { display: true, text: 'f(x)' },
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