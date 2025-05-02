from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)


@app.route('/newton_raphson', methods=['POST'])
def newton_raphson():
    data = request.get_json()

    # Verificar que se hayan enviado todos los parámetros necesarios.
    required_fields = ['funcion', 'derivada', 'error_porcentaje', 'xi']
    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Faltan parámetros. Se requieren 'funcion', 'derivada', 'error_porcentaje' y 'xi'."}), 400

    # Asignar la función y su derivada (en formato de cadena).
    funcion_str = data['funcion']
    derivada_str = data['derivada']

    # Validar y convertir 'error_porcentaje' a número.
    try:
        error_porcentaje = float(data['error_porcentaje'])
    except ValueError:
        return jsonify({"error": "El parámetro 'error_porcentaje' debe ser un número."}), 400

    # Validar y convertir 'xi' a número.
    try:
        xi = float(data['xi'])
    except ValueError:
        return jsonify({"error": "El parámetro 'xi' debe ser un número."}), 400

    # Convertir error porcentual a tolerancia (valor decimal).
    tolerance = error_porcentaje / 100.0

    # Parámetro opcional: número máximo de iteraciones.
    max_iter = 1000
    if 'max_iter' in data:
        try:
            max_iter = int(data['max_iter'])
        except ValueError:
            return jsonify({"error": "El parámetro 'max_iter' debe ser un entero."}), 400

    # Validar la sintaxis de la función y su derivada evaluándolas en un valor de prueba (x = 1).
    try:
        eval(funcion_str, {"x": 1, "np": np})
    except Exception as e:
        return jsonify({"error": "Error en la sintaxis de la función."}), 400

    try:
        eval(derivada_str, {"x": 1, "np": np})
    except Exception as e:
        return jsonify({"error": "Error en la sintaxis de la derivada."}), 400

    # Definir funciones para evaluar f(x) y f'(x) usando eval.
    def f(x):
        try:
            return eval(funcion_str, {"x": x, "np": np})
        except Exception as e:
            raise ValueError("Error al evaluar la función.")

    def df(x):
        try:
            return eval(derivada_str, {"x": x, "np": np})
        except Exception as e:
            raise ValueError("Error al evaluar la derivada.")

    iter_num = 0
    while iter_num < max_iter:
        try:
            fx = f(xi)
            dfx = df(xi)
        except Exception as e:
            return jsonify({"error": str(e)}), 400

        # Verificar que la derivada no sea cero.
        if dfx == 0:
            return jsonify({"error": "La derivada es cero en x = {}. No se puede continuar.".format(xi)}), 400

        # Aplicar la fórmula de Newton-Raphson.
        xn = xi - fx / dfx

        # Verificar convergencia usando error relativo.
        if xn != 0:
            if abs(xn - xi) / abs(xn) < tolerance:
                return jsonify({"resultado": xn, "iteraciones": iter_num}), 200
        else:
            if abs(xn - xi) < tolerance:
                return jsonify({"resultado": xn, "iteraciones": iter_num}), 200

        xi = xn
        iter_num += 1

    # Si se alcanza el máximo de iteraciones, se retorna el último valor calculado.
    return jsonify({"resultado": xn, "iteraciones": max_iter}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
