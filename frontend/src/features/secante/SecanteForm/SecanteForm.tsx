import React, { FormEvent} from "react";
import MathKeyboard from "../../../components/common/EquationKeyboard";
import NumberInput from "../../../components/common/NumberInput/NumberInput";
import './SecanteForm.css'

interface Props {
    latex: string;
    setLatex: (v: string) => void;
    x0: string;
    setX0: (v: string) => void;
    x1: string;
    setX1: (v: string) => void;
    iterations: string;
    setIterations: (v: string) => void;
    tol: string;
    setTol: (v: string) => void;
    error: string | null;
    onSubmit: (e: FormEvent) => void;
}

export default function SecanteForm({
    latex, setLatex,
    x0, setX0,
    x1, setX1,
    iterations, setIterations,
    tol, setTol,
    error, onSubmit
}: Props){
    return (
        <form className="secante-form" onSubmit={onSubmit}>
              <div className='secante-keyboard-wrapper'>
                <MathKeyboard latex={latex} onChange={setLatex} />
              </div>
              <div className="secante-numbers">
                <NumberInput label="x0 *" value={x0} onChange={setX0} />
                <NumberInput label="x1 *" value={x1} onChange={setX1} />
                <NumberInput label="Tolerancia" value={tol} onChange={setTol} />
                <NumberInput label="Iteraciones" value={iterations} onChange={setIterations} />

              </div>
              {error && <p className="secante-error">{error}</p>}
              <button className="secante-submit" type="submit">Calcular</button>
            </form>
    )
}