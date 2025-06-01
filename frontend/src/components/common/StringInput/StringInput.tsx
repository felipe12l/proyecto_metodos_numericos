import React from 'react';
import './StringInput.css';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export default function NumberInput({ label, value, onChange }: Props) {
  return (
    <div className="string-input">
      <label>{label}</label>
      <input
        type="text"
        step="any"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
