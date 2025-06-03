import { useState } from 'react';
import axios from 'axios';
import { parseLatex } from '../../utils/parseLatex';

interface FixedPointResult {
  resultado: number;
  iteraciones: number[];
  func_plot: Array<[number, number]>;
  deriv_plot: Array<[number, number]>;
}

export function useFixedPoint() {
  const [funcion, setFuncion]               = useState('');
  const [derivada, setDerivada]             = useState('');
  const [errorPorcentaje, setErrorPorcentaje] = useState('');
  const [xi, setXi]                         = useState('');
  const [resultado, setResultado]           = useState<number | null>(null);

  const [iteraciones, setIteraciones]       = useState<number[]>([]);
  // Ahora también guardamos func_plot y deriv_plot:
  const [funcPlot, setFuncPlot]             = useState<Array<{ x: number; y: number }>>([]);
  const [derivPlot, setDerivPlot]           = useState<Array<{ x: number; y: number }>>([]);

  const [error, setError]                   = useState<string | null>(null);

  const calculate = async () => {
    setError(null);
    try {
      const payload = {
        funcion: parseLatex(funcion, 'numpy'),
        derivada: parseLatex(derivada, 'numpy'),
        error_porcentaje: parseFloat(errorPorcentaje),
        xi: parseFloat(xi),
      };

      const resp = await axios.post<FixedPointResult>('/fixed_point', payload);

      setResultado(resp.data.resultado);
      setIteraciones(resp.data.iteraciones);

      // Transformar func_plot y deriv_plot a objeto {x, y}
      setFuncPlot(
        resp.data.func_plot.map(([x, y]) => ({ x, y }))
      );
      setDerivPlot(
        resp.data.deriv_plot.map(([x, y]) => ({ x, y }))
      );
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
    iteraciones,
    funcPlot,
    derivPlot,
    error,
    calculate
  };
}
