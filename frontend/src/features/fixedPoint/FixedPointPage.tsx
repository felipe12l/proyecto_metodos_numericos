// FixedPointPage.tsx

import React from 'react';
import FixedPointForm from './FixedPointForm/FixedPointForm';
import { useFixedPoint } from './useFixedPoint';
import ChartWithZoom from '../../components/common/ChartWithZoom/ChartWithZoom';
import './FixedPointPage.css';

export default function FixedPointPage() {
  const {
    funcion, setFuncion,
    derivada, setDerivada,
    errorPorcentaje, setErrorPorcentaje,
    xi, setXi,
    resultado,
    iteraciones,
    error,
    calculate
  } = useFixedPoint();

  // Preparamos safeIter y dataForChart como se mostró antes
  const safeIter = Array.isArray(iteraciones) ? iteraciones : [];
  const dataForChart = safeIter.map((xValue, idx) => ({
    x: idx,
    y: xValue
  }));

  return (
    <div className="fp-page">
      <h2>Método de Punto Fijo</h2>

      <FixedPointForm
        funcion={funcion} setFuncion={setFuncion}
        derivada={derivada} setDerivada={setDerivada}
        errorPorcentaje={errorPorcentaje} setErrorPorcentaje={setErrorPorcentaje}
        xi={xi} setXi={setXi}
        error={error}
        onSubmit={(e) => {
          e.preventDefault();
          calculate();
        }}
      />

      {resultado !== null && (
        <div className="fp-result">
          <p>Resultado convergente:</p>
          <span className="fp-value">{resultado.toFixed(6)}</span>
        </div>
      )}

      {safeIter.length > 1 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Convergencia por Iteraciones</h3>
          <ChartWithZoom data={dataForChart} />
        </div>
      )}
    </div>
  );
}
