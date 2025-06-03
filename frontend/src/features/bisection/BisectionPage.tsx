import ChartWithZoom from "../../components/common/ChartWithZoom/ChartWithZoom";
import { useBisection } from "./useBisection";
import BisectionForm from "./BisectionForm/BisectionForm";
export default function BisectionPage() {
    const {
        latex, setLatex,
        a, setA,
        b, setB,
        tolerance, setTolerance,
        maxIterations, setMaxIterations,
        resultado, iteraciones,
        funcPlot, error,
        calculate
    } = useBisection();
return (
    <div className="bisection-page">
      <h2>Método de Bisección</h2>
      <BisectionForm
        latex={latex} setLatex={setLatex}
        a={a} setA={setA}
        b={b} setB={setB}
        tolerance={tolerance} setTolerance={setTolerance}
        maxIterations={maxIterations} setMaxIterations={setMaxIterations}
        error={error}
        onSubmit={e => { e.preventDefault(); calculate(); }}
      />
      {resultado !== null && (
        <div style={{marginTop: '1rem', background: '#f3f4f6', padding: '1rem', borderRadius: '0.375rem', color: '#1f2937'}}>
          <p>Raíz aproximada: <b>{resultado.toFixed(8)}</b></p>
          <p>Iteraciones: <b>{iteraciones}</b></p>
        </div>
      )}
      {funcPlot.length > 0 && <ChartWithZoom data={funcPlot} />}
    </div>
  );
}