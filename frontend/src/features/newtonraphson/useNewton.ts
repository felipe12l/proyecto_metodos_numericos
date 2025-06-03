import { useState } from "react";
import { parseLatex } from "../../utils/parseLatex";
import { newton } from "../../services/api";

export function useNewton() {
    const [latex, setLatex] = useState('');
    const [x0, setX0] = useState('');
    const [tolerance, setTolerance] = useState('');
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
                x0: parseFloat(x0),
                error_porcentaje: parseFloat(tolerance)
            };
            const resp = await newton(payload);
            setResultado(resp.data.resultado);
            setIteraciones(resp.data.iteraciones);

            // Graficar la función en un rango alrededor de x0
            const fStr = parseLatex(latex, 'numpy');
            // eslint-disable-next-line no-new-func
            const f = new Function('x', `return ${fStr};`);
            const xStart = Math.max(0, parseFloat(x0) - 10);
            const xEnd = parseFloat(x0) + 10;
            const N = 100;
            const points = [];
            for (let i = 0; i <= N; i++) {
                const x = xStart + (xEnd - xStart) * i / N;
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
        x0, setX0,
        tolerance, setTolerance,
        resultado,
        iteraciones,
        funcPlot,
        error,
        calculate
    };
}