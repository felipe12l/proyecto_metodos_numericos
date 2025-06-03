from flask import Flask, request, jsonify
import numpy as np
import sympy as sp

app = Flask(__name__)


@app.route('/newton_raphson', methods=['POST'])
def newton_raphson():
    data = request.get_json()

    # Verificar que se hayan enviado todos los parámetros necesarios.
    required_fields = ['funcion', 'error_porcentaje', 'x0']
    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Faltan parámetros. Se requieren 'funcion', 'error_porcentaje' y 'x0'."}), 400

    funcion_str = data['funcion']
    x = sp.symbols('x')
    try:
        funcion_sympy = sp.sympify(funcion_str)
        derivada_sympy = sp.diff(funcion_sympy, x)
        # Crear funciones numéricas usando lambdify
        f = sp.lambdify(x, funcion_sympy, modules=["numpy"])
        df = sp.lambdify(x, derivada_sympy, modules=["numpy"])
    except Exception as e:
        return jsonify({"error": "No se puede calcular la derivada de la función."}), 400

    # Validar y convertir 'error_porcentaje' a número.
    try:
        error_porcentaje = float(data['error_porcentaje'])
    except ValueError:
        return jsonify({"error": "El parámetro 'error_porcentaje' debe ser un número."}), 400

    # Validar y convertir 'x0' a número.
    try:
        xi = float(data['x0'])
    except ValueError:
        return jsonify({"error": "El parámetro 'x0' debe ser un número."}), 400

    # Convertir error porcentual a tolerancia (valor decimal).
    tolerance = error_porcentaje / 100.0

    # Parámetro opcional: número máximo de iteraciones.
    max_iter = 1000
    if 'max_iter' in data:
        try:
            max_iter = int(data['max_iter'])
        except ValueError:
            return jsonify({"error": "El parámetro 'max_iter' debe ser un entero."}), 400

    iter_num = 0
    while iter_num < max_iter:
        try:
            fx = f(xi)
            dfx = df(xi)
        except Exception as e:
            return jsonify({"error": f"Error al evaluar la función o su derivada: {str(e)}"}), 400

        # Verificar que la derivada no sea cero.
        if dfx == 0:
            return jsonify({"error": f"La derivada es cero en x = {xi}. No se puede continuar."}), 400

        # Aplicar la fórmula de Newton-Raphson.
        try:
            xn = xi - fx / dfx
        except ZeroDivisionError:
            return jsonify({"error": f"Ocurrió una división por cero durante el cálculo en x = {xi}."}), 400

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
