// src/utils/parseLatex.ts

/**
 * Convierte expresiones LaTeX sencillas a sintaxis compatible con SymPy:
 * - \left( … \right)          → ( … )
 * - \sin(x), \cos(x), etc.    → sin(x), cos(x)
 * - \frac{a}{b}               → (a)/(b)
 * - \sqrt{expr}               → sqrt(expr)
 * - \cdotsqrt(expr)           → *sqrt(expr)
 * - 2\cdot x\cdot y           → 2*x*y
 * - Exponenciación ^{n} o ^n  → **n
 */
export function parseLatex(latex: string, mode: 'sympy' | 'numpy' = 'sympy'): string {
  let s = latex;
  // 0) Quitar \left \right
  s = s.replace(/\\left/g, '').replace(/\\right/g, '');

  // 1) Fracciones y raíces iguales para ambos
  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)');
  s = s.replace(/\\sqrt\{([^}]*)\}/g, 'sqrt($1)');

  // 2) Funciones trigonométricas y log, adaptando a NumPy o a SymPy
  if (mode === 'numpy') {
    s = s.replace(/\\sin/g, 'np.sin');
    s = s.replace(/\\cos/g, 'np.cos');
    s = s.replace(/\\tan/g, 'np.tan');
    s = s.replace(/\\exp/g, 'np.exp');
    s = s.replace(/\\log/g, 'np.log');
    // …cualquier otra función de NumPy que uses (np.sqrt, np.abs, etc.)…
  } else {
    s = s.replace(/\\sin/g, 'sin');
    s = s.replace(/\\cos/g, 'cos');
    s = s.replace(/\\tan/g, 'tan');
    s = s.replace(/\\exp/g, 'exp');
    s = s.replace(/\\log/g, 'log');
    // …y así para funciones simbólicas en SymPy…
  }

  // 3) Multiplicaciones con \cdot y exponenciación (idénticas para ambos):
  s = s.replace(/\\cdot/g, '*');
  s = s.replace(/([A-Za-z0-9]+)\^\{([^}]*)\}/g, '$1**$2');
  s = s.replace(/([A-Za-z0-9]+)\^([0-9]+)/g, '$1**$2');

  // 4) Limpieza final
  return s.trim();
}

