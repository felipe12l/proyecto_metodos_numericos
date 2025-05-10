import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import zoomPlugin from 'chartjs-plugin-zoom';
  import { Line } from 'react-chartjs-2';
  import { useEffect } from 'react';
  import './ChartWithZoom.css';

  
  // Registrar componentes y plugin
  ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    zoomPlugin
  );
  
  interface ChartProps {
    data: { x: number; y: number }[];
  }
  
  export default function ChartWithZoom({ data }: ChartProps) {
    // Formatea datos para Chart.js
    const labels = data.map((p) => p.x);
    const dataset = {
      labels,
      datasets: [
        {
          data: data.map(p => p.y),
          borderColor: 'var(--chart-line-color)',
          backgroundColor: 'var(--chart-fill-color)',
          pointBackgroundColor: 'var(--chart-point-color)',
          fill: false,
          borderWidth: 2,
        },
      ],
    };
  
    const options = {
      scales: {
        x: { type: 'linear', position: 'bottom' },
      },
      plugins: {
        zoom: {
          pan: { enabled: true, mode: 'xy' },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  
    return (
      <div className="chart-container">
        <Line data={dataset} options={options} />
      </div>
    );
  }
  