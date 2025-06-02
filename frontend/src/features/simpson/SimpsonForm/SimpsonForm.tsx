// src/features/simpson/SimpsonForm/SimpsonForm.tsx

import React, { FormEvent } from 'react';
import MathKeyboard from '../../../components/common/EquationKeyboard/MathKeyboard';
import NumberInput from '../../../components/common/NumberInput/NumberInput';
import './SimpsonForm.css';

interface Props {
  funcion: string;
  setFuncion: (v: string) => void;
  limiteInferior: string;
  setLimiteInferior: (v: string) => void;
  limiteSuperior: string;
  setLimiteSuperior: (v: string) => void;
  intervalos: string;
  setIntervalos: (v: string) => void;
  error: string | null;
  onSubmit: (e: FormEvent) => void;
}

export default function SimpsonForm({
  funcion, setFuncion,
  limiteInferior, setLimiteInferior,
  limiteSuperior, setLimiteSuperior,
  intervalos, setIntervalos,
  error,
  onSubmit
}: Props) {
  return (
    <form className="simpson-form" onSubmit={onSubmit}>
      {/* Función f(x) */}
      <div className='simpson-funcion-keyboard-wrapper'>
        <label htmlFor="funcion">Función f(x):</label>
        <MathKeyboard latex={funcion} onChange={setFuncion} />
      </div>

      {/* Límites y número de intervalos */}
      <div className="simpson-row">
        <NumberInput
          label="Límite inferior (a)"
          value={limiteInferior}
          onChange={setLimiteInferior}
        />
        <NumberInput
          label="Límite superior (b)"
          value={limiteSuperior}
          onChange={setLimiteSuperior}
        />
        <NumberInput
          label="Intervalos (n, par)"
          value={intervalos}
          onChange={setIntervalos}
        />
      </div>

      {/* Mostrar mensaje de error si existe */}
      {error && <p className="simpson-error">{error}</p>}

      <button className="simpson-submit" type="submit">
        Calcular Simpson
      </button>
    </form>
  );
}
