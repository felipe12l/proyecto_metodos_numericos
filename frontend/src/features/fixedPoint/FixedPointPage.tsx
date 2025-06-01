// frontend/src/features/fixedPoint/FixedPointPage.tsx

import React from 'react';
import FixedPointForm from './FixedPointForm/FixedPointForm';
import { useFixedPoint } from './useFixedPoint';
import './FixedPointPage.css';

export default function FixedPointPage() {
  const {
    funcion, setFuncion,
    derivada, setDerivada,
    errorPorcentaje, setErrorPorcentaje,
    xi, setXi,
    resultado,
    error,
    calculate
  } = useFixedPoint();

  return (
    <div className="fp-page">
      <h2>Método de Punto Fijo</h2>
      <FixedPointForm
        funcion={funcion} setFuncion={setFuncion}
        derivada={derivada} setDerivada={setDerivada}
        errorPorcentaje={errorPorcentaje} setErrorPorcentaje={setErrorPorcentaje}
        xi={xi} setXi={setXi}
        error={error}
        onSubmit={(e) => { e.preventDefault(); calculate(); }}
      />

      {resultado !== null && (
        <div className="fp-result">
          <p>Resultado convergente:</p>
          <span className="fp-value">{resultado.toFixed(6)}</span>
        </div>
      )}
    </div>
  );
}
