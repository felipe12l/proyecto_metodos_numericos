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

            // Usa los puntos que vienen del backend
            setFuncPlot(resp.data.puntos || []);

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