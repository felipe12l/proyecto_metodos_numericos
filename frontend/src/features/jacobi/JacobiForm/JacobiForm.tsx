import React, { FormEvent } from 'react';
import NumberInput from '../../../components/common/NumberInput/NumberInput';
import StringInput from '../../../components/common/StringInput/StringInput';
import './JacobiForm.css';

interface Props {
  n: number;
  A: string[][];
  b: string[];
  errorPorcentaje: string;
  error: string | null;
  updateA: (i: number, j: number, val: string) => void;
  updateB: (i: number, val: string) => void;
  setErrorPorcentaje: (val: string) => void;
  changeOrder: (newOrder: number) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function JacobiForm({
  n,
  A,
  b,
  errorPorcentaje,
  error,
  updateA,
  updateB,
  setErrorPorcentaje,
  changeOrder,
  onSubmit
}: Props) {
  return (
    <form className="jacobi-form" onSubmit={onSubmit}>
      <div className="jacobi-row">
        <label htmlFor="order">Orden (n):</label>
        <input
          type="number"
          id="order"
          min="2"
          value={n}
          onChange={(e) => {
            const newOrder = parseInt(e.target.value, 10);
            if (!isNaN(newOrder) && newOrder >= 2) {
              changeOrder(newOrder);
            }
          }}
        />
      </div>

      <div className="jacobi-matrix-container">
        <p className="jacobi-section-title">Matriz A ({n}×{n}):</p>
        <table className="jacobi-matrix">
          <tbody>
            {Array.from({ length: n }, (_, i) => (
              <tr key={`row-${i}`}>
                {Array.from({ length: n }, (_, j) => (
                  <td key={`cell-${i}-${j}`}>
                    <StringInput
                      label={`a${i + 1}${j + 1}`}
                      value={A[i][j]}
                      onChange={(v) => updateA(i, j, v)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="jacobi-vector-container">
        <p className="jacobi-section-title">Vector b ({n}):</p>
        <div className="jacobi-vector-inputs">
          {Array.from({ length: n }, (_, i) => (
            <StringInput
              key={`b-${i}`}
              label={`b${i + 1}`}
              value={b[i]}
              onChange={(v) => updateB(i, v)}
            />
          ))}
        </div>
      </div>

      <div className="jacobi-row">
        <NumberInput
          label="Error (%)"
          value={errorPorcentaje}
          onChange={setErrorPorcentaje}
        />
      </div>

      {error && <p className="jacobi-error">{error}</p>}

      <button className="jacobi-submit" type="submit">
        Calcular
      </button>
    </form>
  );
}
