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
          label: 'y(x)',
          data: data.map((p) => p.y),
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
      <div style={{ height: 400, width: '100%' }}>
        <Line data={dataset} options={options} />
      </div>
    );
  }
  