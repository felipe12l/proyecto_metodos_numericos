import React from 'react';
import JacobiForm from './JacobiForm/JacobiForm';
import { useJacobi } from './useJacobi';
import './JacobiPage.css';

export default function JacobiPage() {
  const {
    n,
    A,
    b,
    errorPorcentaje,
    resultado,
    iterations,
    converged,
    error,
    updateA,
    updateB,
    setErrorPorcentaje,
    changeOrder,
    calculate
  } = useJacobi();

  return (
    <div className="jacobi-page">
      <h2>Jacobi</h2>

      <JacobiForm
        n={n}
        A={A}
        b={b}
        errorPorcentaje={errorPorcentaje}
        error={error}
        updateA={updateA}
        updateB={updateB}
        setErrorPorcentaje={setErrorPorcentaje}
        changeOrder={changeOrder}
        onSubmit={(e) => {
          e.preventDefault();
          calculate();
        }}
      />

        {resultado && (converged ? 
        (
            <div className="jacobi-result">
            <h3>Solución (x):</h3>
            <ul>
                {resultado.map((xi, idx) => (
                <li key={idx}>
                    x<sub>{idx + 1}</sub> = {xi.toFixed(6)}
                </li>
                ))}
            </ul>
            <p className="jacobi-iter">
                Iteraciones realizadas: <strong>{iterations}</strong>
            </p>
            </div>
        ) : (
            <div className="jacobi-error">
            <h3 style={{ color: 'red' }}>El método no converge. No se encontró solución.</h3>
            </div>
        )
        )}

    </div>
  );
}
