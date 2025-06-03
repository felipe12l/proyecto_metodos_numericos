from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

def gauss_seidel(A, b, tolerance=1e-10, max_iter=1000):
    A = np.array(A, dtype=float)
    b = np.array(b, dtype=float)
    n = A.shape[0]

    # Vector inicial: ceros
    x = np.zeros_like(b, dtype=np.double)

    # Lista para almacenar el historial completo de vectores x^{(k)}
    # Cada entrada será una lista de floats: [x1^{(k)}, x2^{(k)}, …, xn^{(k)}]
    historial = [x.tolist()]

    for iter_num in range(1, max_iter + 1):
        x_new = np.copy(x)
        # Actualización Gauss–Seidel
        for i in range(n):
            suma = 0.0
            for j in range(n):
                if i != j:
                    suma += A[i][j] * x_new[j]
            x_new[i] = (b[i] - suma) / A[i][i]

        # Agregamos x_new al historial
        historial.append(x_new.tolist())

        # Verificar convergencia con norma Euclidiana
        if np.linalg.norm(x_new - x) < tolerance:
            # Retornamos x_new, número de iteraciones (excluyendo el paso 0), y el historial
            return x_new.tolist(), iter_num, historial

        x = x_new

    # Si llegamos al max_iter sin converger, devolvemos también el historial completo
    return x_new.tolist(), max_iter, historial


@app.route('/gauss_seidel', methods=['POST'])
def gauss_seidel_service():
    data = request.get_json()
    required_fields = ['A', 'b', 'error_porcentaje']
    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Faltan parámetros. Se requieren 'A', 'b' y 'error_porcentaje'."}), 400

    # Convertir parámetros
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

    try:
        A = np.array(data['A'], dtype=float)
        b = np.array(data['b'], dtype=float)
    except Exception:
        return jsonify({"error": "Error al convertir 'A' o 'b' a números."}), 400

    # Validar dimensiones
    if A.ndim != 2 or A.shape[0] != A.shape[1]:
        return jsonify({"error": "La matriz A debe ser cuadrada."}), 400
    if A.shape[0] != b.size:
        return jsonify({"error": "La dimensión de A y b no coinciden."}), 400

    try:
        resultado, iteraciones, historial = gauss_seidel(A, b, tolerance, max_iter)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    # Devolvemos JSON con:
    # - resultado: vector solución final
    # - iteraciones: número de iteraciones usadas
    # - historial: lista de vectores [x^(0), x^(1), …, x^(N)]
    return jsonify({
        "resultado":   resultado,
        "iteraciones": iteraciones,
        "historial":   historial
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
