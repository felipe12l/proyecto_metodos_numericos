import React from "react";
import TrapecioForm from "./TrapecioForm/TrapecioForm";
import { useTrapecio } from "./useTrapecio";
import TrapecioGraph from "../../components/common/TrapecioGraph";

import './TrapecioPage.css';

export default function TrapecioPage() {
  const {
    latex, setLatex,
    a, setA,
    b, setB,
    n, setN,
    result, error,
    calculate,
  } = useTrapecio();

  const range = {
    start: parseFloat(a) || 0,
    end: parseFloat(b) || 0,
    step: (parseFloat(b) - parseFloat(a)) / 100 || 0.1,
  };

  return (
    <div className="trapecio-page">
      <h2>Trapecio</h2>
      <TrapecioForm
        latex={latex} setLatex={setLatex}
        a={a} setA={setA}
        b={b} setB={setB}
        n={n} setN={setN}
        error={error}
        onSubmit={e => { e.preventDefault(); calculate(); }}
      />

      {result && (
        <div className="trapecio-results">
          <div className="calculation-results">
            <h3>Resultados del Cálculo</h3>
            <div className="result-item">
              <h2>Valor de la integral:</h2>
              <span className="result-value">{result.integral.toFixed(6)}</span>
            </div>
            <div className="result-item">
              <h2>Número de subintervalos:</h2>
              <span className="result-value">{result.subintervals}</span>
            </div>
            
          </div>

          {result.trapezoid_points && (
            <div className="chart-container">
              <h3>Gráfico</h3>
              <TrapecioGraph
                expression={result.function}
                trapPoints={result.trapezoid_points}
                range={range}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
