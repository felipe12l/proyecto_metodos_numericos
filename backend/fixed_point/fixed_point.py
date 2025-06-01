# fixed_point.py (modificado)
from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/fixed_point', methods=['POST'])
def fixed_point():
    data = request.get_json()

    # 1) Verificamos campos
    required_fields = ['funcion', 'derivada', 'error_porcentaje', 'xi']
    if not data or any(field not in data for field in required_fields):
        return jsonify({
            "error": "Faltan parámetros. Se requieren 'funcion', 'derivada', 'error_porcentaje' y 'xi'."
        }), 400

    funcion_str   = data['funcion']
    derivada_str  = data['derivada']

    # 2) Convertir y validar números
    try:
        error_porcentaje = float(data['error_porcentaje'])
    except ValueError:
        return jsonify({"error": "El parámetro 'error_porcentaje' debe ser un número."}), 400

    try:
        xi = float(data['xi'])
    except ValueError:
        return jsonify({"error": "El parámetro 'xi' debe ser un número."}), 400

    # 3) Validar sintaxis de f(x) y g(x) con un valor de prueba x=1
    try:
        eval(funcion_str,  {"X": 1, "x": 1, "np": np})
    except Exception:
        return jsonify({"error": "Error en la sintaxis de la función original."}), 400

    try:
        eval(derivada_str, {"X": 1, "x": 1, "np": np})
    except Exception:
        return jsonify({"error": "Error en la sintaxis de la función derivada."}), 400

    # 4) Tolerancia decimal
    tolerancia = error_porcentaje / 100.0

    # 5) Arreglo para guardar iteraciones de xi
    iteraciones = [xi]

    # 6) Definir g(x) = función de iteración
    def transformed_function(x):
        try:
            return eval(derivada_str, {"X": x, "x": x, "np": np})
        except Exception:
            raise ValueError("Error al evaluar la función derivada.")

    # 7) Bucle de iteración hasta convergencia
    while True:
        try:
            xn = transformed_function(xi)
        except Exception:
            return jsonify({
                "error": "Error al evaluar la función derivada durante la iteración."
            }), 400

        iteraciones.append(xn)

        if xn == 0:
            if abs(xn - xi) < tolerancia:
                break
        else:
            if abs(xn - xi) / abs(xn) < tolerancia:
                break

        xi = xn

    # 8) Una vez convergido, preparamos datos para graficar f(x) y g(x)
    todos_x = np.array(iteraciones)
    x_min = np.min(todos_x)
    x_max = np.max(todos_x)

    # Para no quedar pegados justo en los extremos, ampliamos un poco el rango:
    delta = (x_max - x_min) * 0.2 if (x_max - x_min) != 0 else abs(x_max)*0.2 + 1e-3
    a = x_min - delta
    b = x_max + delta

    # Creamos un arreglo de 200 puntos equiespaciados en [a, b]
    xs_sample = np.linspace(a, b, 200)

    # Evaluar f(x) sobre xs_sample
    try:
        f_vals = [eval(funcion_str,  {"X": xx, "x": xx, "np": np}) for xx in xs_sample]
    except Exception:
        return jsonify({
            "error": "Error al evaluar f(x) sobre el rango de muestreo."
        }), 400

    # Evaluar g(x) sobre xs_sample
    try:
        g_vals = [eval(derivada_str, {"X": xx, "x": xx, "np": np}) for xx in xs_sample]
    except Exception:
        return jsonify({
            "error": "Error al evaluar g(x) sobre el rango de muestreo."
        }), 400

    # 9) Retornamos JSON con:
    #    - resultado: el valor convergido xn
    #    - iteraciones: la lista de iteraciones [x0, x1, x2, …]
    #    - func_plot: arreglo de par [x, f(x)] para graficar f
    #    - deriv_plot: arreglo de par [x, g(x)] para graficar g
    response = {
        "resultado": xn,
        "iteraciones": iteraciones,
        "func_plot":   [[float(xx), float(f_val)] for xx, f_val in zip(xs_sample, f_vals)],
        "deriv_plot":  [[float(xx), float(g_val)] for xx, g_val in zip(xs_sample, g_vals)],
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
