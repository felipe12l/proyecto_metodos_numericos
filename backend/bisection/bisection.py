from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)


@app.route('/biseccion', methods=['POST'])
def bisection():
    data = request.get_json()

    # Verificar que se hayan enviado los parámetros necesarios.
    required_fields = ['funcion', 'a', 'b', 'error_porcentaje']
    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Faltan parámetros. Se requieren 'funcion', 'a', 'b' y 'error_porcentaje'."}), 400

    # Asignar los parámetros recibidos a variables locales.
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

    # Convertir el error porcentual a tolerancia (valor decimal)
    tolerance = error_porcentaje / 100.0

    # Parámetro opcional: número máximo de iteraciones
    max_iter = 1000
    if 'max_iter' in data:
        try:
            max_iter = int(data['max_iter'])
        except ValueError:
            return jsonify({"error": "El parámetro 'max_iter' debe ser un entero."}), 400

    # Validar la sintaxis de la función evaluándola en los extremos del intervalo.
    try:
        f_a = eval(funcion_str, {"x": a, "np": np})
        f_b = eval(funcion_str, {"x": b, "np": np})
    except Exception as e:
        return jsonify({"error": "Error en la sintaxis de la función."}), 400

    # Verificar que la función cambie de signo en el intervalo [a, b].
    if f_a * f_b >= 0:
        return jsonify({"error": "La función no cambia de signo en el intervalo [a, b]."}), 400

    iter_num = 0
    c = a  # Punto medio inicial
    while iter_num < max_iter:
        # Calcular el punto medio del intervalo.
        c = (a + b) / 2.0

        # Evaluar la función en el punto medio.
        try:
            f_c = eval(funcion_str, {"x": c, "np": np})
        except Exception as e:
            return jsonify({"error": "Error al evaluar la función en el punto medio."}), 400

        # Si la función en c es casi cero o el intervalo es suficientemente pequeño, consideramos que hemos convergido.
        if abs(f_c) < tolerance or (b - a) / 2.0 < tolerance:
            return jsonify({"resultado": c, "iteraciones": iter_num}), 200

        # Actualizar el intervalo según el signo en c.
        if f_a * f_c < 0:
            b = c
            f_b = f_c
        else:
            a = c
            f_a = f_c

        iter_num += 1

    # Si se alcanza el máximo de iteraciones, se retorna el último valor calculado.
    return jsonify({"resultado": c, "iteraciones": max_iter}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
