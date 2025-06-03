import React from 'react';
import './TrapecioForm.css';
import MathKeyboard from '../../../components/common/EquationKeyboard';
import NumberInput from '../../../components/common/NumberInput/NumberInput';

interface Props {
    latex: string;
    setLatex: (value: string) => void;
    a: string;
    setA: (value: string) => void;
    b: string;
    setB: (value: string) => void;
    n: string;
    setN: (value: string) => void;
    error: string | null;
    onSubmit: (e: React.FormEvent) => void;
}


export default function SecanteForm({
    latex, setLatex,
    a, setA,
    b, setB,
    n, setN,
    error, 
    onSubmit
}: Props){
    return (
        <form className="trapecio-form" onSubmit={onSubmit}>
              <div className='secante-keyboard-wrapper'>
                <MathKeyboard latex={latex} onChange={setLatex} />
              </div>
              <div className="trapecio-numbers">
                <NumberInput label="Limite superior (a)" value={a} onChange={setA} />
                <NumberInput label="Limite inferior (b)" value={b} onChange={setB} />
                <NumberInput label="Numero intervalos (n)" value={n} onChange={setN} />

              </div>
              {error && <p className="trapecio-error">{error}</p>}
              <button className="trapecio-submit" type="submit">Calcular</button>
            </form>
    )
}