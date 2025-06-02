import React, { FormEvent } from 'react';
import MathKeyboard from '../../../components/common/EquationKeyboard/MathKeyboard';
import NumberInput from '../../../components/common/NumberInput/NumberInput';
import './FixedPointForm.css';

interface Props {
  funcion: string;
  setFuncion: (v: string) => void;
  derivada: string;
  setDerivada: (v: string) => void;
  errorPorcentaje: string;
  setErrorPorcentaje: (v: string) => void;
  xi: string;
  setXi: (v: string) => void;
  error: string | null;
  onSubmit: (e: FormEvent) => void;
}

export default function FixedPointForm({
  funcion, setFuncion,
  derivada, setDerivada,
  errorPorcentaje, setErrorPorcentaje,
  xi, setXi,
  error, onSubmit
}: Props) {
  return (
    <form className="fp-form" onSubmit={onSubmit}>
      <label htmlFor="funcion">Función f(x):</label>
      <MathKeyboard latex={funcion} onChange={setFuncion} />

      <label htmlFor="derivada">g(x) (transformada):</label>
      <MathKeyboard latex={derivada} onChange={setDerivada} />

      <div className="fp-numbers">
        <NumberInput
          label="Error (%)"
          value={errorPorcentaje}
          onChange={setErrorPorcentaje}
        />
        <NumberInput
          label="x₀"
          value={xi}
          onChange={setXi}
        />
      </div>

      {error && <p className="fp-error">{error}</p>}

      <button className="fp-submit" type="submit">
        Calcular Punto Fijo
      </button>
    </form>
  );
}
