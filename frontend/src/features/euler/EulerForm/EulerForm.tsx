import { FormEvent } from 'react';
import MathKeyboard from '../../../components/common/EquationKeyboard/MathKeyboard';
import NumberInput from '../../../components/common/NumberInput/NumberInput';
import './EulerForm.css';

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

export default function EulerForm({
  latex, setLatex,
  initialX, setInitialX,
  initialY, setInitialY,
  step, setStep,
  finalValue, setFinalValue,
  error, onSubmit
}: Props) {
  return (
    <form className="euler-form" onSubmit={onSubmit}>
      <div className='euler-keyboard-wrapper'>
        <label htmlFor="latex">Ecuacion diferencial ordinal:</label>
        <MathKeyboard latex={latex} onChange={setLatex} />
      </div>
      <div className="euler-numbers">
        <NumberInput label="X inicial" value={initialX} onChange={setInitialX} />
        <NumberInput label="Y inicial" value={initialY} onChange={setInitialY} />
        <NumberInput label="Pasos"      value={step}      onChange={setStep}      />
        <NumberInput label="Valor final de X" value={finalValue} onChange={setFinalValue} />
      </div>
      {error && <p className="euler-error">{error}</p>}
      <button className="euler-submit" type="submit">Calcular</button>
    </form>
  );
}
