from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)


def gauss_seidel(A, b, tolerance=1e-10, max_iter=1000):
    # Convertir a arrays numéricos (tipo float)
    try:
        # error_porcentaje = float(data['error_porcentaje'])
        A = np.array(A, dtype=float)
        b = np.array(b, dtype=float)
    except ValueError:
        return jsonify({"error": "A y b deben ser matrices con elemntos de tipo float"}), 400
    

    # Validar dimensiones
    if A.ndim != 2 or A.shape[0] != A.shape[1]:
        raise ValueError("La matriz A debe ser cuadrada.")
    if A.shape[0] != b.size:
        raise ValueError(
            "El tamaño de b debe coincidir con el número de filas de A.")

    # Vector inicial: ceros
    x = np.zeros_like(b, dtype=np.double)

    for iter_num in range(max_iter):
        x_new = np.copy(x)
        n = A.shape[0]
        for i in range(n):
            suma = 0
            for j in range(n):
                if i != j:
                    # Se usa x_new para aplicar la actualización inmediata
                    suma += A[i][j] * x_new[j]
            x_new[i] = (b[i] - suma) / A[i][i]
        # Verificar convergencia usando la norma Euclidiana
        if np.linalg.norm(x_new - x) < tolerance:
            return x_new.tolist(), iter_num  # Convertimos a lista para JSON
        x = x_new
    return x_new.tolist(), max_iter


@app.route('/gauss_seidel', methods=['POST'])
def gauss_seidel_service():
    data = request.get_json()

    # Verificar que se hayan enviado los parámetros necesarios.
    required_fields = ['A', 'b', 'error_porcentaje']
    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Faltan parámetros. Se requieren 'A', 'b' y 'error_porcentaje'."}), 400

    # Intentar convertir 'error_porcentaje' a número
    try:
        error_porcentaje = float(data['error_porcentaje'])
    except ValueError:
        return jsonify({"error": "El parámetro 'error_porcentaje' debe ser un número."}), 400

    # Convertir error porcentual a tolerancia (valor decimal)
    tolerance = error_porcentaje / 100.0

    # Parámetro opcional: número máximo de iteraciones
    max_iter = 1000
    if 'max_iter' in data:
        try:
            max_iter = int(data['max_iter'])
        except ValueError:
            return jsonify({"error": "El parámetro 'max_iter' debe ser un entero."}), 400

    # Validar y convertir A y b a arrays numéricos
    try:
        A = np.array(data['A'], dtype=float)
        b = np.array(data['b'], dtype=float)
    except Exception as e:
        return jsonify({"error": "Error al convertir 'A' o 'b' a números."}), 400

    # Validar dimensiones: A debe ser cuadrada y la dimensión de b debe coincidir.
    if A.ndim != 2 or A.shape[0] != A.shape[1]:
        return jsonify({"error": "La matriz A debe ser cuadrada."}), 400
    if A.shape[0] != b.size:
        return jsonify({"error": "La dimensión de A y b no coinciden."}), 400

    # Ejecutar el método Gauss-Seidel
    try:
        resultado, iteraciones = gauss_seidel(A, b, tolerance, max_iter)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    # Retornar el resultado en formato JSON con código HTTP 200.
    return jsonify({"resultado": resultado, "iteraciones": iteraciones}), 200


if __name__ == '__main__':
    # El servidor escucha en todas las interfaces en el puerto 5000.
    app.run(host='0.0.0.0', port=5000)
