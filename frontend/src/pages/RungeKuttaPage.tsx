import { useState, FormEvent } from 'react';
import MathKeyboard from '../components/EquationKeyboard';
import ChartWithZoom from '../components/ChartWithZoom';
import { rungeKutta } from '../services/api';
import { parseLatex } from '../utils/parseLatex';

export default function RungeKuttaPage() {
  const [latex, setLatex] = useState<string>('');
  const [initialX, setInitialX] = useState<string>('');
  const [initialY, setInitialY] = useState<string>('');
  const [step, setStep] = useState<string>('');
  const [finalValue, setFinalValue] = useState<string>('');
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    //Convierte latex a formato SymPy
    const equation = parseLatex(latex);

    const payload = {
      equation, 
      initial_x: parseFloat(initialX),
      initial_y: parseFloat(initialY),
      step: parseFloat(step),
      final_value: parseFloat(finalValue),
    };

    try {
      const resp = await rungeKutta(payload);
      const points = resp.data.result.map(([x, y]: [number, number]) => ({ x, y }));
      setData(points);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Calculadora Runge–Kutta</h2>
      <form onSubmit={handleSubmit}>
        <MathKeyboard latex={latex} onChange={setLatex} />

        {/* Parámetros numéricos */}
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <input
            type="number" placeholder="initial_x"
            value={initialX} onChange={e => setInitialX(e.target.value)}
          />
          <input
            type="number" placeholder="initial_y"
            value={initialY} onChange={e => setInitialY(e.target.value)}
          />
          <input
            type="number" placeholder="step"
            value={step} onChange={e => setStep(e.target.value)}
          />
          <input
            type="number" placeholder="final_value"
            value={finalValue} onChange={e => setFinalValue(e.target.value)}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{ marginTop: 10 }}>Calcular</button>
      </form>

      {/* Gráfica con zoom */}
      {data.length > 0 && <ChartWithZoom data={data} />}
    </div>
  );
}
