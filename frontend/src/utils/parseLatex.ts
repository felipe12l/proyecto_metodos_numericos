// src/utils/parseLatex.ts

/**
 * Convierte expresiones LaTeX sencillas a sintaxis compatible con NumPy:
 * - \left( … \right)                    → ( … )
 * - \sin(x), \cos(x), etc.              → np.sin(x), np.cos(x), etc.   (cuando mode='numpy')
 * - \frac{a}{b}                         → (a)/(b)
 * - \frac a b (sin llaves, ej. \frac92) → (a)/(b)
 * - \sqrt{expr}                         → sqrt(expr)
 * - \cdotsqrt(expr)                     → *sqrt(expr)
 * - a\cdot b\cdot c                     → a*b*c
 * - Exponenciación x^{n} o x^n          → x**n
 */
export function parseLatex(
  latex: string,
  mode: 'sympy' | 'numpy' | 'js' = 'sympy'
): string {
  let s = latex;

  // 0) Quitar metacaracteres \left y \right
  s = s.replace(/\\left/g, '').replace(/\\right/g, '');

  // 0.1) Manejar fracciones “sin llaves” del tipo \frac a b o \frac92
  // Patrón: \frac<token1><token2>, donde token puede ser dígito, letra o expresión parentetizada
  // Ejemplos: \frac92   →  (9)/(2)
  //           \frac x y  →  (x)/(y)
  s = s.replace(
    /\\frac\s*([A-Za-z0-9]+)\s*([A-Za-z0-9]+)/g,
    '($1)/($2)'
  );

  // 1) Fracciones “con llaves”: \frac{a}{b} → (a)/(b)
  s = s.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)');

  // 2) Raíz cuadrada “básica”: \sqrt{expr} → sqrt(expr)
  s = s.replace(/\\sqrt\{([^}]*)\}/g, 'sqrt($1)');

  // 3) Notación extendida \cdotsqrt(expr) o \cdotsqrt{expr} → *sqrt(expr)
  s = s.replace(
    /([A-Za-z0-9\)\]])\\cdotsqrt(?:\{([^}]*)\}|\(([^)]*)\))/g,
    (_match, prefix, g1, g2) => {
      const content = g1 ?? g2;
      return `${prefix}*sqrt(${content})`;
    }
  );

  // 4) Multiplicación con \cdot: a\cdot b\cdot c → a*b*c
  s = s.replace(/\\cdot/g, '*');

  // 5) Exponenciación con llaves: x^{n} → x**n
  s = s.replace(/([A-Za-z0-9]+)\^\{([^}]*)\}/g, '$1**$2');

  // 6) Exponenciación sin llaves: x^2 → x**2
  s = s.replace(/([A-Za-z0-9]+)\^([0-9]+)/g, '$1**$2');

  // 7) Funciones trigonométricas y logaritmos según modo
  if (mode === 'numpy') {
    s = s.replace(/\\sin/g, 'np.sin');
    s = s.replace(/\\cos/g, 'np.cos');
    s = s.replace(/\\tan/g, 'np.tan');
    s = s.replace(/\\exp/g, 'np.exp');
    s = s.replace(/\\log/g, 'np.log');
    // También sqrt se convierte a np.sqrt cuando sea necesario en el backend
    s = s.replace(/sqrt\(/g, 'np.sqrt(');
  } else {
    s = s.replace(/\\sin/g, 'sin');
    s = s.replace(/\\cos/g, 'cos');
    s = s.replace(/\\tan/g, 'tan');
    s = s.replace(/\\exp/g, 'exp');
    s = s.replace(/\\log/g, 'log');
    // sqrt queda como sqrt(  para SymPy
  }

  if (mode === 'js') {
    s = s.replace(/([A-Za-z0-9\)\]])\*\*([A-Za-z0-9]+)/g, 'Math.pow($1,$2)');
    s = s.replace(/\bsin\b/g, 'Math.sin');
    s = s.replace(/\bcos\b/g, 'Math.cos');
    s = s.replace(/\btan\b/g, 'Math.tan');
    s = s.replace(/\bsqrt\b/g, 'Math.sqrt');
    s = s.replace(/\blog\b/g, 'Math.log');
    s = s.replace(/\bexp\b/g, 'Math.exp');
  }
  // 8) Limpieza de espacios redundantes
  return s.replace(/\s+/g, ' ').trim();
}
