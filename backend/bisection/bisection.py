from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)


@app.route('/bisection', methods=['POST'])
def bisection():
    data = request.get_json()
    required_fields = ['funcion', 'a', 'b', 'error_porcentaje']
    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Faltan parámetros. Se requieren 'funcion', 'a', 'b' y 'error_porcentaje'."}), 400

    funcion_str = data['funcion']
    try:
        a = float(data['a'])
        b = float(data['b'])
    except ValueError:
        return jsonify({"error": "Los parámetros 'a' y 'b' deben ser números."}), 400

    try:
        error_porcentaje = float(data['error_porcentaje'])
    except ValueError:
        return jsonify({"error": "El parámetro 'error_porcentaje' debe ser un número."}), 400

    tolerance = error_porcentaje / 100.0
    max_iter = 1000
    if 'max_iter' in data:
        try:
            max_iter = int(data['max_iter'])
        except ValueError:
            return jsonify({"error": "El parámetro 'max_iter' debe ser un entero."}), 400

    # Generar puntos para graficar la función en el intervalo [a, b]
    N = 100
    puntos = []
    for i in range(N + 1):
        x = a + (b - a) * i / N
        try:
            y = eval(funcion_str, {"x": x, "np": np})
        except Exception:
            y = None
        puntos.append({"x": x, "y": y})

    try:
        f_a = eval(funcion_str, {"x": a, "np": np})
        f_b = eval(funcion_str, {"x": b, "np": np})
    except Exception as e:
        return jsonify({"error": "Error en la sintaxis de la función."}), 400

    if abs(f_a) < tolerance:
        puntos.append({"x": a, "y": f_a, "special": True})
        return jsonify({"resultado": a, "iteraciones": 0, "puntos": puntos}), 200
    if abs(f_b) < tolerance:
        puntos.append({"x": b, "y": f_b, "special": True})
        return jsonify({"resultado": b, "iteraciones": 0, "puntos": puntos}), 200

    if f_a * f_b > 0:
        return jsonify({"error": "La función no cambia de signo en el intervalo [a, b]."}), 400

    iter_num = 0
    c = a
    while iter_num < max_iter:
        c = (a + b) / 2.0
        try:
            f_c = eval(funcion_str, {"x": c, "np": np})
        except Exception as e:
            return jsonify({"error": "Error al evaluar la función en el punto medio."}), 400
        except ZeroDivisionError:
            return jsonify({"error": "Error de división por cero en la evaluación de la función."}), 400

        if abs(f_c) < tolerance or (b - a) / 2.0 < tolerance:
            puntos.append({"x": c, "y": f_c, "special": True})
            return jsonify({"resultado": c, "iteraciones": iter_num, "puntos": puntos}), 200

        if f_a * f_c < 0:
            b = c
            f_b = f_c
        else:
            a = c
            f_a = f_c

        iter_num += 1

    # Si se alcanza el máximo de iteraciones, se retorna el último valor calculado.
    try:
        f_c = eval(funcion_str, {"x": c, "np": np})
    except Exception:
        f_c = None
    puntos.append({"x": c, "y": f_c, "special": True})
    return jsonify({"resultado": c, "iteraciones": max_iter, "puntos": puntos}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
