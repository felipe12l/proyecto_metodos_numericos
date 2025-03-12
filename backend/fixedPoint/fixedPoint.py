from flask import Flask, request, jsonify
import numpy as np


app = Flask(__name__)


@app.route('/fixedPoint', methods=['POST'])
def fixedPoint():

    data = request.get_json()

    # Verificamos que se hayan enviado todos los parámetros necesarios.
    required_fields = ['funcion', 'derivada', 'error_porcentaje', 'xi']
    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Faltan parámetros. Se requieren 'funcion', 'derivada', 'error_porcentaje' y 'xi'."}), 400

    # Asignamos los valores recibidos a variables locales.
    funcion_str = data['funcion']
    derivada_str = data['derivada']

    # Validamos que 'error_porcentaje' se pueda convertir a número.
    try:
        error_porcentaje = float(data['error_porcentaje'])
    except ValueError:
        return jsonify({"error": "El parámetro 'error_porcentaje' debe ser un número."}), 400

    # Validamos que 'xi' se pueda convertir a número.
    try:
        xi = float(data['xi'])
    except ValueError:
        return jsonify({"error": "El parámetro 'xi' debe ser un número."}), 400

    # Validamos la sintaxis de la función original evaluándola con un valor de prueba (x=1).
    try:
        eval(funcion_str, {"X": 1, "x": 1, "np": np})
    except Exception as e:
        return jsonify({"error": "Error en la sintaxis de la función original."}), 400

    # Validamos la sintaxis de la función derivada evaluándola con un valor de prueba (x=1).
    try:
        eval(derivada_str, {"X": 1, "x": 1, "np": np})
    except Exception as e:
        return jsonify({"error": "Error en la sintaxis de la función derivada."}), 400

    # Convertimos el error porcentual a tolerancia (valor decimal)
    tolerancia = error_porcentaje / 100.0

    # Definimos una función que evalúa la función derivada en un valor 'x'
    def transformedFunction(x):
        # Se evalúa la cadena 'derivada_str' reemplazando 'x' por el valor recibido.
        try:
            return eval(derivada_str, {"X": x, "x": x, "np": np})
        except Exception as e:
            # En caso de error durante la evaluación, se propaga el error.
            raise ValueError("Error al evaluar la función derivada.")

    # Proceso iterativo para la convergencia:
    # Se aplica la función transformada hasta que el error relativo sea menor que la tolerancia.
    while True:
        try:
            xn = transformedFunction(xi)
        except Exception as e:
            return jsonify({"error": "Error al evaluar la función derivada durante la iteración."}), 400

        # Evitamos división por cero al calcular el error relativo.
        if xn == 0:
            if abs(xn - xi) < tolerancia:
                break
        else:
            if abs(xn - xi) / abs(xn) < tolerancia:
                break
        # Actualizamos xi para la siguiente iteración.
        xi = xn

    # Una vez convergido, se retorna el resultado en formato JSON con código HTTP 200.
    return jsonify({"resultado": xn}), 200


# Inicia la aplicación si se ejecuta el script directamente.
if __name__ == '__main__':
    # Se configura el servidor para escuchar en todas las interfaces de red en el puerto 5000.
    app.run(host='0.0.0.0', port=5000)
