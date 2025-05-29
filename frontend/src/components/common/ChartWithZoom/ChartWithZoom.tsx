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

interface Point { x: number; y: number; }
interface Props { data: Point[]; }

export default function ChartWithZoom({ data }: Props) {
  const labels = data.map(p => p.x);
  const chartData: ChartData<'line'> = {
    labels,
    datasets: [{
      label: 'y(x)',
      data: data.map(p => p.y),
      fill: false,
      borderColor: 'var(--chart-line-color)',
      backgroundColor: 'var(--chart-fill-color)',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#ff5722',
      pointBorderColor: '#e91e63',
      pointBorderWidth: 1.5,
    }]
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
          text: 'Valor de x',
          font: { size: 14 },
          color: '#333'
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valor de y',
          font: { size: 14 },
          color: '#333'
        },
      },
    },
    plugins: {
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
