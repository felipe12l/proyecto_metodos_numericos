import { useState } from 'react';
import { secante } from '../../services/api';
import { parseLatex } from '../../utils/parseLatex';

export function useSecante(){
    const [latex, setLatex] = useState('');
    const [x0, setX0] = useState('');
    const [x1, setX1] = useState('');
    const [iterations, setIterations] = useState('');
    const [tol, setTol] = useState('');
    const [result, setResult] = useState<{ root: number, iteracion: number, points: { x: number; y: number; special?: boolean}[]} | null > (null);
    const [error, setError] = useState<string | null>(null);

    const calculate = async () => {
        setError(null);
        try {
            if (!latex.trim()) {
                setError('La función es requerida');
                return;
            }
            if (!x0 || !x1) {
                setError('Los valores iniciales x0 y x1 son requeridos');
                return;
            }
            const payload = {
                function: parseLatex(latex),
                x0: parseFloat(x0),
                x1: parseFloat(x1),
                iterations: iterations ? parseInt(iterations) : 100, 
                tol: tol ? parseFloat(tol) : 1e-6,
            };
            const resp = await secante(payload);
            if (resp.data.error) {
                setError(resp.data.error);
              } else {
                setResult(resp.data.result);
            }
        }catch(err: any) {
            console.log('Error en la solicitud:', err);
            setError(err.response?.data?.error || err.message)
        }
    };

    return{
        latex, setLatex,
        x0, setX0,
        x1, setX1,
        iterations, setIterations,
        tol, setTol, 
        result, error,
        calculate
    }
}