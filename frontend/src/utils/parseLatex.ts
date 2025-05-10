// src/utils/parseLatex.ts

/**
 * Convierte expresiones LaTeX sencillas a sintaxis compatible con SymPy:
 * - \left( … \right)          → ( … )
 * - \frac{a}{b}               → (a)/(b)
 * - \sqrt{expr}               → sqrt(expr)
 * - \cdotsqrt(expr)           → *sqrt(expr)
 * - 2\cdot x\cdot y           → 2*x*y
 * - Exponenciación ^{n} o ^n  → **n
 */
export function parseLatex(latex: string): string {
  let s = latex;

  // 0) Quitar metacaracteres \left y \right
  s = s.replace(/\\left/g, '').replace(/\\right/g, '');

  // 1) Fracciones: \frac{a}{b} → (a)/(b)
  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)');

  // 2) Raíz cuadrada normal: \sqrt{expr} → sqrt(expr)
  s = s.replace(/\\sqrt\{([^}]*)\}/g, 'sqrt($1)');

  // 3) Notación extendida \cdotsqrt(expr) o \cdotsqrt{expr} → *sqrt(expr)
  s = s.replace(
    /([A-Za-z0-9\)\]])\\cdotsqrt(?:\{([^}]*)\}|\(([^)]*)\))/g,
    (_match, prefix, g1, g2) => {
      const content = g1 ?? g2;
      return `${prefix}*sqrt(${content})`;
    }
  );

  // 4) Productos con \cdot: a\cdot b\cdot c → a*b*c
  s = s.replace(/\\cdot/g, '*');

  // 5) Exponenciación con llaves: x^{n} → x**n
  s = s.replace(/([A-Za-z0-9]+)\^\{([^}]*)\}/g, '$1**$2');

  // 6) Exponenciación sin llaves: x^2 → x**2
  s = s.replace(/([A-Za-z0-9]+)\^([0-9]+)/g, '$1**$2');

  // 7) Limpieza de espacios múltiples
  return s.replace(/\s+/g, ' ').trim();
}
