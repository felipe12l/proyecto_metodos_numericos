import { useState } from "react";
import { parseLatex } from "../../utils/parseLatex";
import { bisection } from "../../services/api";

export function useBisection() {
    const [latex, setLatex] = useState('');
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [tolerance, setTolerance] = useState('');
    const [maxIterations, setMaxIterations] = useState('');
    const [resultado, setResultado] = useState<number | null>(null);
    const [iteraciones, setIteraciones] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [funcPlot, setFuncPlot] = useState<{ x: number; y: number }[]>([]);

    const calculate = async () => {
        setError(null);
        setResultado(null);
        setIteraciones(null);
        try {
            const payload: any = {
                funcion: parseLatex(latex, 'numpy'),
                a: parseFloat(a),
                b: parseFloat(b),
                error_porcentaje: parseFloat(tolerance)
            };
            if (maxIterations) {
                payload.max_iter = parseInt(maxIterations, 10);
            }
            const resp = await bisection(payload);
            setResultado(resp.data.resultado);
            setIteraciones(resp.data.iteraciones);

            // Graficar la función en el rango [a, b]
            const fStr = parseLatex(latex, 'numpy');
            // eslint-disable-next-line no-new-func
            const f = new Function('x', `return ${fStr};`);
            const x0 = parseFloat(a);
            const x1 = parseFloat(b);
            const N = 100;
            const points = [];
            for (let i = 0; i <= N; i++) {
                const x = x0 + (x1 - x0) * i / N;
                let y = NaN;
                try { y = f(x); } catch {}
                points.push({ x, y });
            }
            setFuncPlot(points);

        } catch (err: any) {
            setError(err.response?.data?.error || err.message);
        }
    };

    return {
        latex, setLatex,
        a, setA,
        b, setB,
        tolerance, setTolerance,
        maxIterations, setMaxIterations,
        resultado,
        iteraciones,
        funcPlot,
        error,
        calculate
    };
}