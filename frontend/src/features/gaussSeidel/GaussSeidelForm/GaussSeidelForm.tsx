// src/features/gaussSeidel/GaussSeidelForm/GaussSeidelForm.tsx

import React, { FormEvent } from 'react';
import NumberInput from '../../../components/common/NumberInput/NumberInput';
import StringInput from '../../../components/common/StringInput/StringInput';
import './GaussSeidelForm.css';

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

export default function GaussSeidelForm({
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
    <form className="gs-form" onSubmit={onSubmit}>
      {/* Selector del orden n */}
      <div className="gs-row">
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

      {/* Matriz A: n x n */}
      <div className="gs-matrix-container">
        <p className="gs-section-title">Matriz A ({n}×{n}):</p>
        <table className="gs-matrix">
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

      {/* Vector b: longitud n */}
      <div className="gs-vector-container">
        <p className="gs-section-title">Vector b ({n}):</p>
        <div className="gs-vector-inputs">
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

      {/* Error porcentual */}
      <div className="gs-row">
        <NumberInput
          label="Error (%)"
          value={errorPorcentaje}
          onChange={setErrorPorcentaje}
        />
      </div>

      {/* Mostrar mensaje de error si existe */}
      {error && <p className="gs-error">{error}</p>}

      {/* Botón de enviar */}
      <button className="gs-submit" type="submit">
        Calcular Gauss–Seidel
      </button>
    </form>
  );
}
