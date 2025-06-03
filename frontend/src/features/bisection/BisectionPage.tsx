import ChartWithZoom from "../../components/common/ChartWithZoom/ChartWithZoom";
import ChartWithZoomMulti from "../../components/common/ChartWithZoom/ChartWithZoomMulti";
import ChartWithRoot from "../../components/common/ChartWithZoom/ChartWithRoot";
import { useBisection } from "./useBisection";
import BisectionForm from "./BisectionForm/BisectionForm";
import { parseLatex } from "../../utils/parseLatex";
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
          {/* Mostrar f(raiz) */}
          <p>
            f(raíz) ≈ <b>
              {(() => {
                try {
                  // Convertir latex a función JS
                  const fStrNumpy = parseLatex(latex, 'numpy');
                  const fStrJS = fStrNumpy.replace(/np\./g, 'Math.');
                  const f = new Function('x', `return ${fStrJS};`);
                  return f(resultado).toExponential(3);
                } catch {
                  return 'NaN';
                }
              })()}
            </b>
          </p>
        </div>
      )}
      {funcPlot.length > 0 && (
        <ChartWithRoot data={funcPlot} />
      )}
    </div>
  );
}