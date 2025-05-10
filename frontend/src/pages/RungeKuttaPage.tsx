import React from 'react';
import RungeKuttaForm from '../components/RungeKuttaForm/RungeKuttaForm';
import ChartWithZoom from '../components/ChartWithZoom/ChartWithZoom';
import { useRungeKutta } from '../hooks/useRungeKutta';

export default function RungeKuttaPage() {
  const {
    latex, setLatex,
    initialX, setInitialX,
    initialY, setInitialY,
    step, setStep,
    finalValue, setFinalValue,
    data, error,
    calculate
  } = useRungeKutta();

  return (
    <div style={{ padding: 20 }}>
      <h2>Calculadora Runge–Kutta</h2>
      <RungeKuttaForm
        latex={latex} setLatex={setLatex}
        initialX={initialX} setInitialX={setInitialX}
        initialY={initialY} setInitialY={setInitialY}
        step={step} setStep={setStep}
        finalValue={finalValue} setFinalValue={setFinalValue}
        error={error} onSubmit={(e) => { e.preventDefault(); calculate(); }}
      />

      {data.length > 0 && <ChartWithZoom data={data} />}
    </div>
  );
}
