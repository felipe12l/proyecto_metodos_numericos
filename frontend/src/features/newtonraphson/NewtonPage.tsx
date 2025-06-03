export default function NewtonPage() {
    const {
        latex, setLatex,
        x0, setX0,
        tolerance, setTolerance,
    }= useNewton();
    return(<div>
        <h1>Newton-Raphson Method</h1>
        <LatexInput value={latex} onChange={setLatex} />
        <NumberInput label="Initial Guess (x0)" value={x0} onChange={setX0} />
        <NumberInput label="Tolerance" value={tolerance} onChange={setTolerance} />
        <button onClick={handleSubmit}>Submit</button>
    </div>)
}