import { useState } from 'react';
import axios from 'axios';
import { parseLatex } from '../../utils/parseLatex';

interface FixedPointResult {
  resultado: number;
}

export function useFixedPoint() {
  const [funcion, setFuncion] = useState('');
  const [derivada, setDerivada] = useState('');
  const [errorPorcentaje, setErrorPorcentaje] = useState('');
  const [xi, setXi] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = async () => {
    setError(null);
    try {
      const payload = {
        funcion: parseLatex(funcion),
        derivada: parseLatex(derivada),
        error_porcentaje: parseFloat(errorPorcentaje),
        xi: parseFloat(xi),
      };

      const resp = await axios.post<FixedPointResult>('/fixed_point', payload);
      setResultado(resp.data.resultado);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return {
    funcion, setFuncion,
    derivada, setDerivada,
    errorPorcentaje, setErrorPorcentaje,
    xi, setXi,
    resultado,
    error,
    calculate
  };
}
