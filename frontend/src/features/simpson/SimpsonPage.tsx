import React from 'react';
import SimpsonForm from './SimpsonForm/SimpsonForm';
import { useSimpson } from './useSimpson';
import SimpsonChart from '../../components/common/SimpsonChart/SimpsonChart';
import './SimpsonPage.css';

export default function SimpsonPage() {
  const {
    funcion, setFuncion,
    limiteInferior, setLimiteInferior,
    limiteSuperior, setLimiteSuperior,
    intervalos, setIntervalos,
    resultado,
    infoCalculo,
    funcPlot,
    puntosSimpson,
    error,
    calculate
  } = useSimpson();

  return (
    <div className="simpson-page">
      <h2>Método de Simpson</h2>

      <SimpsonForm
        funcion={funcion}
        setFuncion={setFuncion}
        limiteInferior={limiteInferior}
        setLimiteInferior={setLimiteInferior}
        limiteSuperior={limiteSuperior}
        setLimiteSuperior={setLimiteSuperior}
        intervalos={intervalos}
        setIntervalos={setIntervalos}
        error={error}
        onSubmit={(e) => {
          e.preventDefault();
          calculate();
        }}
      />

      {/* Mostrar resultado cuando exista */}
      {resultado !== null && infoCalculo && (
        <div className="simpson-result">
          <h3>Resultado de la Integral:</h3>
          <p className="simpson-valor">
            ∫<sub>ₐ</sub>ᵇ f(x) dx ≈ <strong>{resultado.toFixed(6)}</strong>
          </p>

          <div className="simpson-info">
            <p><strong>Límite inferior (a):</strong> {infoCalculo.limite_inferior}</p>
            <p><strong>Límite superior (b):</strong> {infoCalculo.limite_superior}</p>
            <p><strong>Intervalos (n):</strong> {infoCalculo.numero_intervalos}</p>
            <p><strong>Ancho de intervalo (h):</strong> {infoCalculo.ancho_intervalo.toFixed(6)}</p>
            <p><strong>Número de puntos:</strong> {infoCalculo.numero_puntos}</p>
          </div>
        </div>
      )}

      {/* Mostrar gráfica con la curva y los nodos */}
      {funcPlot.length > 0 && puntosSimpson.length > 0 && (
        <>
          <h3>Gráfica de f(x) y nodos de Simpson</h3>
          <SimpsonChart funcPlot={funcPlot} puntosSimpson={puntosSimpson} />
        </>
      )}
    </div>
  );
}
