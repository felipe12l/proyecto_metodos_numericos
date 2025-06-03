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
    const [funcPlot, setFuncPlot] = useState<{ x: number; y: number; special?: boolean }[]>([]);

    const calculate = async () => {
        setError(null);
        setResultado(null);
        setIteraciones(null);
        try {
            const payload: any = {
                funcion: parseLatex(latex, 'sympy'),
                x0: parseFloat(x0),
                error_porcentaje: parseFloat(tolerance)
            };
            const resp = await newton(payload);
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
        x0, setX0,
        tolerance, setTolerance,
        resultado,
        iteraciones,
        funcPlot,
        error,
        calculate
    };
}