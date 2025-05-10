import { useRef, useEffect } from 'react';
import 'mathlive';  // Si usas MathLive Web Component

interface KeyboardProps {
  latex: string;
  onChange: (newLatex: string) => void;
}

export default function MathKeyboard({ latex, onChange }: KeyboardProps) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      // Evento input de MathLive
      ref.current.addEventListener('input', (e: any) =>
        onChange(e.target.value)
      );
    }
  }, [onChange]);

  return (
    <div>
      <math-field
        ref={ref}
        virtual-keyboard-mode="onfocus"
        value={latex}
        style={{ '--mathlive-theme': 'dark' }}
      />
    </div>
  );
}
