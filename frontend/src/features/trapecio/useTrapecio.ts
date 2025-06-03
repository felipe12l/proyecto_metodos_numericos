import { useState } from 'react';
import { trapecio } from '../../services/api';
import { parseLatex } from '../../utils/parseLatex';

interface TrapecioResult {
    integral: number;
    subintervals: number;
    a: number;
    b: number;
    function: string;
    trapezoid_points: { x: number; y: number }[];
}

export function useTrapecio() {
    const [latex, setLatex] = useState('');
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [n, setN] = useState('');
    const [result, setResult] = useState<TrapecioResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const calculate = async () => {
        setError(null);
        try {
            if (!latex.trim()) {
                setError('La función es requerida');
                return;
            }
            if (!a || !b) {
                setError('Los límites de integración a y b son requeridos');
                return;
            }
            if (!n) {
                setError('El número de subintervalos es requerido');
                return;
            }

            const aNum = parseFloat(a);
            const bNum = parseFloat(b);
            const nNum = parseInt(n);

            if (isNaN(aNum) || isNaN(bNum) || isNaN(nNum)) {
                setError('Por favor ingresa valores numéricos válidos');
                return;
            }

            if (nNum < 1) {
                setError('El número de subintervalos debe ser mayor a 0');
                return;
            }

            if (aNum >= bNum) {
                setError('El límite inferior debe ser menor al superior');
                return;
            }

            const payload = {
                function: parseLatex(latex),
                a: aNum,
                b: bNum,
                n: nNum
            };

            const resp = await trapecio(payload);
            if (resp.data.error) {
                setError(resp.data.error);
            } else {
                setResult(resp.data); // ✅ resp.data ya es el objeto con los datos
            }
        } catch (err: any) {
            console.error('Error en la solicitud:', err);
            setError(err.response?.data?.error || err.message);
        }
    };

    return {
        latex, setLatex,
        a, setA,
        b, setB,
        n, setN,
        result, error,
        calculate
    };
}
