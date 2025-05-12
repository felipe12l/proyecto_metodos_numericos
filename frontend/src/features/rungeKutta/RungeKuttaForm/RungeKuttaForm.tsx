import React, { FormEvent } from 'react';
import MathKeyboard from '../../../components/EquationKeyboard/MathKeyboard';
import NumberInput from '../../../components/common/NumberInput';
import './RungeKuttaForm.css';

interface Props {
  latex: string;
  setLatex: (v: string) => void;
  initialX: string;
  setInitialX: (v: string) => void;
  initialY: string;
  setInitialY: (v: string) => void;
  step: string;
  setStep: (v: string) => void;
  finalValue: string;
  setFinalValue: (v: string) => void;
  error: string | null;
  onSubmit: (e: FormEvent) => void;
}

export default function RungeKuttaForm({
  latex, setLatex,
  initialX, setInitialX,
  initialY, setInitialY,
  step, setStep,
  finalValue, setFinalValue,
  error, onSubmit
}: Props) {
  return (
    <form className="rk-form" onSubmit={onSubmit}>
      <div className='rk-keyboard-wrapper'>
        <MathKeyboard latex={latex} onChange={setLatex} />
      </div>
      <div className="rk-numbers">
        <NumberInput label="X inicial" value={initialX} onChange={setInitialX} />
        <NumberInput label="Y inicial" value={initialY} onChange={setInitialY} />
        <NumberInput label="Paso"      value={step}      onChange={setStep}      />
        <NumberInput label="Valor final" value={finalValue} onChange={setFinalValue} />
      </div>
      {error && <p className="rk-error">{error}</p>}
      <button className="rk-submit" type="submit">Calcular</button>
    </form>
  );
}
