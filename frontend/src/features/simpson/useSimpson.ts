// src/features/simpson/useSimpson.ts

import { useState } from 'react';
import axios from 'axios';
import { parseLatex } from '../../utils/parseLatex';

interface InfoCalculo {
  limite_inferior: number;
  limite_superior: number;
  numero_intervalos: number;
  ancho_intervalo: number;
  numero_puntos: number;
}

interface SimpsonResult {
  resultado: number;
  info_calculo: InfoCalculo;
  func_plot: Array<[number, number]>;
  puntos_simpson: Array<[number, number]>;
}

export function useSimpson() {
  // Estado de formulario
  const [funcion, setFuncion] = useState<string>('');           // LaTeX de f(x)
  const [limiteInferior, setLimiteInferior] = useState<string>('0');
  const [limiteSuperior, setLimiteSuperior] = useState<string>('1');
  const [intervalos, setIntervalos] = useState<string>('2');    // Debe ser string para input

  // Estado de resultado
  const [resultado, setResultado] = useState<number | null>(null);
  const [infoCalculo, setInfoCalculo] = useState<InfoCalculo | null>(null);
  const [funcPlot, setFuncPlot] = useState<Array<{ x: number; y: number }>>([]);
  const [puntosSimpson, setPuntosSimpson] = useState<Array<{ x: number; y: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  // Helpers para parsear strings numéricos (permitir fracciones, etc.) si lo deseas.
  // Por simplicidad, usaremos parseFloat directamente y validamos.
  const parseNumber = (s: string, campo: string): number => {
    const v = parseFloat(s);
    if (isNaN(v)) throw new Error(`El campo '${campo}' debe ser un número válido.`);
    return v;
  };

  const calculate = async () => {
    setError(null);
    setResultado(null);
    setInfoCalculo(null);
    setFuncPlot([]);
    setPuntosSimpson([]);

    try {
      // 1) Parsear números
      const a = parseNumber(limiteInferior, 'límite inferior');
      const b = parseNumber(limiteSuperior, 'límite superior');
      const n = parseInt(intervalos, 10);
      if (isNaN(n)) throw new Error(`El número de intervalos debe ser un entero.`);
      
      // 2) Validar condiciones
      if (a >= b) {
        throw new Error('El límite inferior debe ser menor que el límite superior.');
      }
      if (n <= 0 || n % 2 !== 0) {
        throw new Error('El número de intervalos debe ser un entero par mayor que 0.');
      }
      if (!funcion || funcion.trim() === '') {
        throw new Error('Debes ingresar la función f(x).');
      }

      // 3) Parsear LaTeX a sintaxis NumPy
      const fStr = parseLatex(funcion, 'numpy');

      // 4) Construir payload
      const payload = {
        funcion: fStr,
        limite_inferior: a,
        limite_superior: b,
        intervalos: n
      };

      // 5) Llamar al endpoint
      const resp = await axios.post<SimpsonResult>('/simpson', payload);

      // 6) Guardar estado con la respuesta
      setResultado(resp.data.resultado);
      setInfoCalculo(resp.data.info_calculo);

      // Mapear func_plot a objetos {x,y}
      const curva = resp.data.func_plot.map(([x, y]) => ({ x, y }));
      setFuncPlot(curva);

      // Mapear puntos_simpson a objetos {x,y}
      const nodos = resp.data.puntos_simpson.map(([x, y]) => ({ x, y }));
      setPuntosSimpson(nodos);
    } catch (err: any) {
      // Si axios retorna un error con respuesta JSON
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido en el cálculo.');
      }
    }
  };

  return {
    funcion, setFuncion,
    limiteInferior, setLimiteInferior,
    limiteSuperior, setLimiteSuperior,
    intervalos, setIntervalos,
    resultado,
    infoCalculo,
    funcPlot,
    puntosSimpson,
    error,
    calculate
  };
}
