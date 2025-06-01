# frontend/src/features/fixedPoint/fixed_point.py
from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/fixed_point', methods=['POST'])
def fixed_point():
    data = request.get_json()

    # Campos requeridos
    required_fields = ['funcion', 'derivada', 'error_porcentaje', 'xi']
    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Faltan parámetros. Se requieren 'funcion', 'derivada', 'error_porcentaje' y 'xi'."}), 400

    funcion_str = data['funcion']
    derivada_str = data['derivada']

    # Validar error_porcentaje
    try:
        error_porcentaje = float(data['error_porcentaje'])
    except ValueError:
        return jsonify({"error": "El parámetro 'error_porcentaje' debe ser un número."}), 400

    # Validar xi
    try:
        xi = float(data['xi'])
    except ValueError:
        return jsonify({"error": "El parámetro 'xi' debe ser un número."}), 400

    # Validar sintaxis de la función original (con X=1 de prueba)
    try:
        eval(funcion_str, {"X": 1, "x": 1, "np": np})
    except Exception:
        return jsonify({"error": "Error en la sintaxis de la función original."}), 400

    # Validar sintaxis de la función derivada
    try:
        eval(derivada_str, {"X": 1, "x": 1, "np": np})
    except Exception:
        return jsonify({"error": "Error en la sintaxis de la función derivada."}), 400

    # Tolerancia decimal
    tolerancia = error_porcentaje / 100.0

    # Lista para guardar cada xi en el proceso
    iteraciones = [xi]

    # Función transformada (g(x))
    def transformed_function(x):
        try:
            return eval(derivada_str, {"X": x, "x": x, "np": np})
        except Exception:
            raise ValueError("Error al evaluar la función derivada.")

    # Iterar hasta convergencia
    while True:
        try:
            xn = transformed_function(xi)
        except Exception:
            return jsonify({"error": "Error al evaluar la función derivada durante la iteración."}), 400

        # Guardar el nuevo valor antes de comparar
        iteraciones.append(xn)

        # Condición de paro
        if xn == 0:
            if abs(xn - xi) < tolerancia:
                break
        else:
            if abs(xn - xi) / abs(xn) < tolerancia:
                break

        xi = xn

    # Retornar resultado y lista de convergencia
    return jsonify({"resultado": xn, "iteraciones": iteraciones}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
