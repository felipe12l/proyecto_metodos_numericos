// src/features/gaussSeidel/useGaussSeidel.ts

import { useState } from 'react';
import axios from 'axios';

interface GaussSeidelResult {
  resultado: number[];    // Vector solución final
  iteraciones: number;    // Cantidad de iteraciones realizadas
}

export function useGaussSeidel() {
  const [n, setN] = useState<number>(2);

  // Matriz A como strings (p. ej. "1/2", "3")
  const [A, setA] = useState<string[][]>(
    Array.from({ length: n }, () => Array.from({ length: n }, () => '0'))
  );
  const [b, setB] = useState<string[]>(Array.from({ length: n }, () => '0'));
  const [errorPorcentaje, setErrorPorcentaje] = useState<string>('0.01');

  const [resultado, setResultado]       = useState<number[] | null>(null);
  const [iteraciones, setIteraciones]   = useState<number | null>(null);
  const [error, setError]               = useState<string | null>(null);

  // Función auxiliar para parsear "a/b" o "(a/b)" o números simples
  const parseValue = (value: string): number => {
    let s = value.trim();
    if (s.startsWith('(') && s.endsWith(')')) {
      s = s.slice(1, -1).trim();
    }
    if (s.includes('/')) {
      const parts = s.split('/');
      if (parts.length !== 2) {
        throw new Error(`Formato de fracción inválido: "${value}"`);
      }
      const num = parseFloat(parts[0].trim());
      const den = parseFloat(parts[1].trim());
      if (isNaN(num) || isNaN(den) || den === 0) {
        throw new Error(`Fracción inválida: "${value}"`);
      }
      return num / den;
    }
    const num = parseFloat(s);
    if (isNaN(num)) {
      throw new Error(`No es un número válido: "${value}"`);
    }
    return num;
  };

  const updateA = (i: number, j: number, value: string) => {
    setA((prevA) => {
      const nuevo = prevA.map((fila) => fila.slice());
      nuevo[i][j] = value;
      return nuevo;
    });
  };

  const updateB = (i: number, value: string) => {
    setB((prevB) => {
      const nuevo = prevB.slice();
      nuevo[i] = value;
      return nuevo;
    });
  };

  const changeOrder = (newOrder: number) => {
    setN(newOrder);
    setA(Array.from({ length: newOrder }, () => Array.from({ length: newOrder }, () => '0')));
    setB(Array.from({ length: newOrder }, () => '0'));
  };

  const calculate = async () => {
    setError(null);
    setResultado(null);
    setIteraciones(null);

    try {
      // Convertir A y b usando parseValue para admitir fracciones
      const A_num: number[][] = A.map((fila) =>
        fila.map((celda) => parseValue(celda))
      );
      const b_num: number[] = b.map((val) => parseValue(val));
      const error_num = parseValue(errorPorcentaje);

      // Validaciones
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (isNaN(A_num[i][j])) {
            throw new Error(`Celda A[${i + 1}][${j + 1}] no es válida: "${A[i][j]}"`);
          }
        }
        if (isNaN(b_num[i])) {
          throw new Error(`Entrada b[${i + 1}] no es válida: "${b[i]}"`);
        }
      }
      if (isNaN(error_num) || error_num <= 0) {
        throw new Error(`El error porcentual no es válido: "${errorPorcentaje}"`);
      }

      const payload = {
        A: A_num,
        b: b_num,
        error_porcentaje: error_num,
      };

      // Aquí se usa GaussSeidelResult en lugar de inline type
      const resp = await axios.post<GaussSeidelResult>('/gauss_seidel', payload);

      setResultado(resp.data.resultado);
      setIteraciones(resp.data.iteraciones);
    } catch (err: any) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError(err.response?.data?.error || 'Error desconocido.');
      }
    }
  };

  return {
    n,
    A,
    b,
    errorPorcentaje,
    resultado,
    iteraciones,
    error,
    updateA,
    updateB,
    setErrorPorcentaje,
    changeOrder,
    calculate,
  };
}
