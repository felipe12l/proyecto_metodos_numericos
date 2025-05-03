// src/pages/RungeKuttaPage.tsx

import { useState, FormEvent } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface RKParams {
  equation: string;
  initial_x: number;
  initial_y: number;
  step: number;
  final_value: number;
}

interface Point {
  x: number;
  y: number;
}

export default function RungeKuttaPage() {
  // Estado del formulario
  const [equation, setEquation] = useState<string>('');
  const [initialX, setInitialX] = useState<string>('');
  const [initialY, setInitialY] = useState<string>('');
  const [step, setStep] = useState<string>('');
  const [finalValue, setFinalValue] = useState<string>('');
  
  // Resultado de la API
  const [data, setData] = useState<Point[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Manejador del submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar que todos los campos estén completos
    if (!equation || !initialX || !initialY || !step || !finalValue) {
      setError('Por favor completa todos los campos.');
      return;
    }

    const payload: RKParams = {
      equation,
      initial_x: parseFloat(initialX),
      initial_y: parseFloat(initialY),
      step: parseFloat(step),
      final_value: parseFloat(finalValue)
    };

    try {
      const resp = await axios.post<{ result: [number, number][] }>(
        '/runge_kutta',
        payload
      );

      // Transformar a objetos { x, y }
      const points = resp.data.result.map(([x, y]) => ({ x, y }));
      setData(points);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Runge–Kutta 4° Orden</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <div>
          <label>Ecuación f(x,y): </label>
          <input
            type="text"
            value={equation}
            onChange={e => setEquation(e.target.value)}
            placeholder="e.g. x*sqrt(y)"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label>initial_x:</label>
            <input
              type="number"
              step="any"
              value={initialX}
              onChange={e => setInitialX(e.target.value)}
            />
          </div>
          <div>
            <label>initial_y:</label>
            <input
              type="number"
              step="any"
              value={initialY}
              onChange={e => setInitialY(e.target.value)}
            />
          </div>
          <div>
            <label>step (h):</label>
            <input
              type="number"
              step="any"
              value={step}
              onChange={e => setStep(e.target.value)}
            />
          </div>
          <div>
            <label>final_value:</label>
            <input
              type="number"
              step="any"
              value={finalValue}
              onChange={e => setFinalValue(e.target.value)}
            />
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: '1rem' }}>
          Calcular
        </button>
      </form>

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="y" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
