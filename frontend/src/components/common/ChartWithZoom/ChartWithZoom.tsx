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

interface Point { x: number; y: number; special?: boolean; }
interface Props { data: Point[]; }

export default function ChartWithZoom({ data }: Props) {
  const functionPoints = data.filter(p => !p.special);
  const resultPoints = data.filter(p => p.special);

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
      },
      {
        label: 'Raíz aproximada',
        data: resultPoints.map(p => ({ x: p.x, y: p.y })),
        showLine: false,
        pointRadius: 6,
        pointBackgroundColor: 'red',
        pointBorderColor: 'black',
        pointBorderWidth: 2,
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
