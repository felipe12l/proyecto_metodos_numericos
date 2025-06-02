// src/features/gaussSeidel/GaussSeidelPage.tsx

import React from 'react';
import GaussSeidelForm from './GaussSeidelForm/GaussSeidelForm';
import { useGaussSeidel } from './useGaussSeidel';
import ConvergenceChart from '../../components/common/ConvergenceChart/ConvergenceChart';
import './GaussSeidelPage.css';

export default function GaussSeidelPage() {
  const {
    n,
    A,
    b,
    errorPorcentaje,
    resultado,
    iteraciones,
    historial,
    error,
    updateA,
    updateB,
    setErrorPorcentaje,
    changeOrder,
    calculate
  } = useGaussSeidel();

  return (
    <div className="gs-page">
      <h2>Gauss–Seidel</h2>

      <GaussSeidelForm
        n={n}
        A={A}
        b={b}
        errorPorcentaje={errorPorcentaje}
        error={error}
        updateA={updateA}
        updateB={updateB}
        setErrorPorcentaje={setErrorPorcentaje}
        changeOrder={changeOrder}
        onSubmit={(e) => {
          e.preventDefault();
          calculate();
        }}
      />

      {/* Mostrar resultado cuando exista */}
      {resultado && (
        <div className="gs-result">
          <h3>Solución (x):</h3>
          <ul>
            {resultado.map((xi, idx) => (
              <li key={idx}>
                x<sub>{idx + 1}</sub> = {xi.toFixed(6)}
              </li>
            ))}
          </ul>
          <p className="gs-iter">
            Iteraciones realizadas: <strong>{iteraciones}</strong>
          </p>
        </div>
      )}
      {/* Mostrar gráfica de convergencia solo si hay al menos 2 pasos */}
      {historial && historial.length > 1 && (
        <>
          <h3>Convergencia de cada variable por iteración</h3>
          <ConvergenceChart historial={historial} />
        </>
      )}
    </div>
  );
}
