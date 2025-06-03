import ChartWithZoom from "../../components/common/ChartWithZoom/ChartWithZoom";
import NewtonForm from "./NewtonForm/NewtonForm";
import { useNewton } from "./useNewton";

export default function NewtonPage() {
    const {
        latex, setLatex,
        x0, setX0,
        tolerance, setTolerance,
        resultado, iteraciones,
        funcPlot, error,
        calculate
    } = useNewton();

    return (
        <div className="newton-page">
            <h2>Método de Newton-Raphson</h2>
            <NewtonForm
                latex={latex}
                setLatex={setLatex}
                x0={x0}
                setX0={setX0}
                tolerance={tolerance}
                setTolerance={setTolerance}
                error={error} // <--- aquí se pasa el error
                onSubmit={e => { e.preventDefault(); calculate(); }}
            />
            {resultado !== null && (
                <div style={{ marginTop: '1rem', background: '#f3f4f6', padding: '1rem', borderRadius: '0.375rem', color: '#1f2937' }}>
                    <p>Raíz aproximada: <b>{resultado.toFixed(8)}</b></p>
                    <p>Iteraciones: <b>{iteraciones}</b></p>
                </div>
            )}
            {funcPlot.length > 0 && <ChartWithZoom data={funcPlot} />}
        </div>
    );
}