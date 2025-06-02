import React from "react";
import SecanteForm from "./SecanteForm/SecanteForm";
import ChartWithZoom from "../../components/common/ChartWithZoom";
import { useSecante } from "./useSecante";
import './SecantePage.css'

export default function SecantePage() {
    const {
        latex, setLatex,
        x0, setX0,
        x1, setX1,
        iterations, setIterations,
        tol, setTol, 
        result, error,
        calculate
    } = useSecante();

    return (
        <div className="secante-page">
            <h2>Secante</h2>
            <SecanteForm
                latex={latex} setLatex={setLatex}
                x0={x0} setX0={setX0}
                x1={x1} setX1={setX1}
                iterations={iterations} setIterations={setIterations}
                tol={tol} setTol={setTol}
                error={error}
                onSubmit={e => { e.preventDefault(); calculate(); }}
            />
            {result && (
                <>
                    <div style={{ textAlign: 'center', marginTop: '1rem', color: 'white' }}>
                      <h2>Iteraciones: <strong>{result.iteracion}</strong></h2>
                      <ChartWithZoom data={result.points} />
                    </div>
                  
                </>
            )}
        </div>
    );
}