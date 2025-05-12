import React from 'react';
import RungeKuttaForm from './RungeKuttaForm/RungeKuttaForm';
import ChartWithZoom from '../../components/ChartWithZoom/ChartWithZoom';
import { useRungeKutta } from './useRungeKutta';
import './RungeKuttaPage.css';

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
    <div className="rk-page">
      <h2>Runge–Kutta 4º Orden</h2>
      <RungeKuttaForm
        latex={latex} setLatex={setLatex}
        initialX={initialX} setInitialX={setInitialX}
        initialY={initialY} setInitialY={setInitialY}
        step={step} setStep={setStep}
        finalValue={finalValue} setFinalValue={setFinalValue}
        error={error}
        onSubmit={e => { e.preventDefault(); calculate(); }}
      />
      {data.length > 0 && <ChartWithZoom data={data} />}
    </div>
  );
}
