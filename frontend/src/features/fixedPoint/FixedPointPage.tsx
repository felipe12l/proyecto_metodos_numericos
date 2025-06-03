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
    funcPlot,    
    derivPlot,   
    error,
    calculate
  } = useFixedPoint();

  //Serie de iteraciones para graficar puntos
  const iterData = iteraciones.map((xVal) => ({
    x: xVal,
    y: xVal   
  }));

  // Creamos 3 objetos para cada “serie”:
  const datasets = [
    {
      name: 'f(x)',        
      points: funcPlot      
    },
    {
      name: 'g(x)',        
      points: derivPlot     
    },
    {
      name: 'Iteraciones',  
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
          <p>Despues de <span className='fp-num-iterations'>{iteraciones.length}</span> iteraciones la x más aproximada a la raiz es:</p> 
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
