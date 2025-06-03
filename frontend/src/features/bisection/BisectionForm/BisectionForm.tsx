import MathKeyboard from "../../../components/common/EquationKeyboard";
import NumberInput from "../../../components/common/NumberInput/NumberInput";

interface Props{
      latex: string;
      setLatex: (v: string) => void;
      a: string;
      setA: (v: string) => void;
      b: string;
      setB: (v: string) => void;
      tolerance: string;
      setTolerance: (v: string) => void;
      maxIterations: string;
      setMaxIterations: (v: string) => void;
      error: string | null;
      onSubmit: (e: React.FormEvent) => void;
}
export default function BisectionForm({
  latex, setLatex,
  a, setA,
  b, setB,
  tolerance, setTolerance,
  maxIterations, setMaxIterations,
  error, onSubmit
}: Props) {
  return (
    <form className="bisection-form" onSubmit={onSubmit}>
      <div className='bisection-keyboard-wrapper'>
        <label htmlFor="latex">Ecuacion:</label>
        <MathKeyboard latex={latex} onChange={setLatex} />
      </div>
      <div className="bisection-numbers">
        <NumberInput label="A" value={a} onChange={setA} />
        <NumberInput label="B" value={b} onChange={setB} />
        <NumberInput label="Tolerancia (%)" value={tolerance} onChange={setTolerance} />
        <NumberInput label="Max Iteraciones" value={maxIterations} onChange={setMaxIterations} />
      </div>
      {error && <p className="bisection-error">{error}</p>}
      <button className="bisection-submit" type="submit">Calcular</button>
    </form>
  );
}