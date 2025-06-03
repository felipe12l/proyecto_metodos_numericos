import ChartWithZoom from "../../components/common/ChartWithZoom/ChartWithZoom";
import EulerForm from "./EulerForm/EulerForm";
import { useEuler } from "./useEuler";
import './EulerPage.css';

export default function EulerPage() {
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
      <EulerForm
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
