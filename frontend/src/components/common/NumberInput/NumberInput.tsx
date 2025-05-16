import React from 'react';
import './NumberInput.css';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export default function NumberInput({ label, value, onChange }: Props) {
  return (
    <div className="number-input">
      <label>{label}</label>
      <input
        type="number"
        step="any"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
