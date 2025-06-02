// frontend/src/features/fixedPoint/FixedPointPage.tsx

import React from 'react';
import FixedPointForm from './FixedPointForm/FixedPointForm';
import { useFixedPoint } from './useFixedPoint';
import ChartWithZoomMulti from '../../components/common/ChartWithZoom/ChartWithZoomMulti';
import './FixedPointPage.css';

export default function FixedPointPage() {
  const {
    funcion, setFuncion,
    derivada, setDerivada,
    errorPorcentaje, setErrorPorcentaje,
    xi, setXi,
    resultado,
    iteraciones,
    funcPlot,    // La serie para f(x)
    derivPlot,   // La serie para g(x)
    error,
    calculate
  } = useFixedPoint();

  // 1) Serie de iteraciones para graficar puntos:
  //    Por ejemplo, (x_n, g(x_n)) → para ver cómo g(x) acerca x a la convergencia
  const iterData = iteraciones.map((xVal) => ({
    x: xVal,
    y: xVal   // si quisieras graficar (x_n, f(x_n)) sustituye `y: f(xVal)`
  }));

  // 2) Mantenemos funcPlot y derivPlot intactos: ya vienen como {x, y}

  // 3) Combinar los 3 datasets para pasarlos a ChartWithZoom:
  //    ChartWithZoom recibe un array `data: { x: number; y: number }[]`,
  //    pero si queremos 3 series, tendremos que extender ChartWithZoom
  //    para aceptar varios datasets. Vamos a hacerlo manualmente aquí:

  // Creamos 3 objetos para cada “serie”:
  const datasets = [
    {
      name: 'f(x)',         // etiqueta
      points: funcPlot      // curve f(x) en modo continuo
    },
    {
      name: 'g(x)',         // etiqueta
      points: derivPlot     // curve g(x)
    },
    {
      name: 'Iteraciones',  // iterData es un conjunto de puntos discretos
      points: iterData
    }
  ];

  return (
    <div className="fp-page">
      <h2>Método de Punto Fijo</h2>

      <FixedPointForm
        funcion={funcion} setFuncion={setFuncion}
        derivada={derivada} setDerivada={setDerivada}
        errorPorcentaje={errorPorcentaje} setErrorPorcentaje={setErrorPorcentaje}
        xi={xi} setXi={setXi}
        error={error}
        onSubmit={(e) => { e.preventDefault(); calculate(); }}
      />

      {resultado !== null && (
        <div className="fp-result">
          <p>Resultado convergente:</p>
          <span className="fp-value">{resultado.toFixed(6)}</span>
        </div>
      )}

      {/* Si ya hay datos para graficar f, g e iteraciones */}
      { (funcPlot.length > 0 || derivPlot.length > 0 || iterData.length > 0) && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Gráfica de Convergencia y Funciones</h3>
          <ChartWithZoomMulti datasets={datasets} />
        </div>
      )}
    </div>
  );
}
