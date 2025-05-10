import { useState } from 'react';
import { rungeKutta } from '../services/api';
import { parseLatex } from '../utils/parseLatex';

export function useRungeKutta() {
  const [latex, setLatex] = useState('');
  const [initialX, setInitialX] = useState('');
  const [initialY, setInitialY] = useState('');
  const [step, setStep] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    setError(null);
    try {
      const payload = {
        equation: parseLatex(latex),
        initial_x: parseFloat(initialX),
        initial_y: parseFloat(initialY),
        step: parseFloat(step),
        final_value: parseFloat(finalValue),
      };
      const resp = await rungeKutta(payload);
      setData(resp.data.result.map(([x, y]: [number, number]) => ({ x, y })));
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return {
    latex, setLatex,
    initialX, setInitialX,
    initialY, setInitialY,
    step, setStep,
    finalValue, setFinalValue,
    data, error,
    calculate
  };
}
