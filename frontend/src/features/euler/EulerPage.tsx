import ChartWithZoom from "../../components/common/ChartWithZoom/ChartWithZoom";
import RungeKuttaForm from "../rungeKutta/RungeKuttaForm/RungeKuttaForm";
import { useEuler } from "./useEuler";

export default function RungeKuttaPage() {
  const {
    latex, setLatex,
    initialX, setInitialX,
    initialY, setInitialY,
    step, setStep,
    finalValue, setFinalValue,
    data, error,
    calculate
  } = useEuler();

  return (
    <div className="euler-page">
      <h2>Euler</h2>
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
