import MathKeyboard from "../../../components/common/EquationKeyboard";
import NumberInput from "../../../components/common/NumberInput/NumberInput";
interface Props {
    latex: string;
    setLatex: (v: string) => void;
    x0: string;
    setX0: (v: string) => void;
    tolerance: string;
    setTolerance: (v: string) => void;
    error: string | null;
    onSubmit: (e: React.FormEvent) => void;
}
export default function NewtonForm({
    latex, setLatex,
    x0, setX0,
    tolerance, setTolerance,
    error, onSubmit
}: Props) {
    return (
        <form className="newton-form" onSubmit={onSubmit}>
            <div className='newton-keyboard-wrapper'>
                <label htmlFor="latex">Ecuación:</label>
                <MathKeyboard latex={latex} onChange={setLatex} />
            </div>
            <div className="newton-numbers">
                <NumberInput label="Valor inicial (x0)" value={x0} onChange={setX0} />
                <NumberInput label="Tolerancia (%)" value={tolerance} onChange={setTolerance} />
            </div>
            {error && <p className="newton-error">{error}</p>}
            <button className="newton-submit" type="submit">Calcular</button>
        </form>
    );
}