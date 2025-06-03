from flask import Flask, request, jsonify
import sympy as sp
import numpy as np

app = Flask(__name__)

@app.route('/newton_raphson', methods=['POST'])
def newton_raphson():
    data = request.get_json()
    required_fields = ['funcion', 'error_porcentaje', 'x0']
    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Faltan parámetros. Se requieren 'funcion', 'error_porcentaje' y 'x0'."}), 400

    funcion_str = data['funcion']
    x = sp.symbols('x')
    try:
        funcion_sympy = sp.sympify(funcion_str)
        derivada_sympy = sp.diff(funcion_sympy, x)
        f = sp.lambdify(x, funcion_sympy, modules=["numpy"])
        df = sp.lambdify(x, derivada_sympy, modules=["numpy"])
    except Exception as e:
        return jsonify({"error": "No se puede calcular la derivada de la función."}), 400

    try:
        error_porcentaje = float(data['error_porcentaje'])
    except ValueError:
        return jsonify({"error": "El parámetro 'error_porcentaje' debe ser un número."}), 400

    try:
        xi = float(data['x0'])
    except ValueError:
        return jsonify({"error": "El parámetro 'x0' debe ser un número."}), 400

    tolerance = error_porcentaje / 100.0
    max_iter = 1000
    if 'max_iter' in data:
        try:
            max_iter = int(data['max_iter'])
        except ValueError:
            return jsonify({"error": "El parámetro 'max_iter' debe ser un entero."}), 400

    iter_num = 0
    xn = xi
    while iter_num < max_iter:
        try:
            fx = f(xn)
            dfx = df(xn)
        except Exception as e:
            return jsonify({"error": f"Error al evaluar la función o su derivada: {str(e)}"}), 400

        if dfx == 0:
            return jsonify({"error": f"La derivada es cero en x = {xn}. No se puede continuar."}), 400

        try:
            x_next = xn - fx / dfx
        except ZeroDivisionError:
            return jsonify({"error": f"Ocurrió una división por cero durante el cálculo en x = {xn}."}), 400

        if x_next != 0:
            if abs(x_next - xn) / abs(x_next) < tolerance:
                xn = x_next
                break
        else:
            if abs(x_next - xn) < tolerance:
                xn = x_next
                break

        xn = x_next
        iter_num += 1

    # Generar puntos para graficar la función en un rango alrededor de x0
    try:
        x0 = float(data['x0'])
    except Exception:
        x0 = xn
    x_min = min(x0, xn) - 5
    x_max = max(x0, xn) + 5
    xs = np.linspace(x_min, x_max, 120)
    puntos = []
    for xx in xs:
        try:
            yy = f(xx)
        except Exception:
            yy = None
        puntos.append({"x": float(xx), "y": float(yy)})
    # Agregar el punto raíz como especial
    try:
        y_root = f(xn)
    except Exception:
        y_root = None
    puntos.append({"x": float(xn), "y": float(y_root), "special": True})

    return jsonify({
        "resultado": xn,
        "iteraciones": iter_num,
        "puntos": puntos
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
