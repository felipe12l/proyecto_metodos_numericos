from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

def is_diagonally_dominant(A):
    n = len(A)
    for i in range(n):
        diag = abs(A[i][i])
        row_sum = sum(abs(A[i][j]) for j in range(n) if i != j)
        if diag < row_sum:
            return False
    return True

def rearrange_to_diagonal_dominance(A, b):
    n = len(A)  # Número de variables
    matriz = np.hstack([A, np.array(b).reshape(-1, 1)])  # Matriz ampliada con el vector b

    for i in range(n):
        max_index = i
        max_value = abs(matriz[i, i])

        for j in range(i+1, n):
            if abs(matriz[j, i]) > max_value:
                max_index = j
                max_value = abs(matriz[j, i])

        if max_index != i:
            matriz[[i, max_index]] = matriz[[max_index, i]]  # Intercambiar filas

    A_reorganizado = matriz[:, :-1]
    b_reorganizado = matriz[:, -1]

    return A_reorganizado, b_reorganizado

def jacobi_method(A, b, tol=1e-6, max_iter=100):
    n = len(A)
    x = np.zeros(n)
    x_new = np.zeros(n)

    for _ in range(max_iter):
        for i in range(n):
            sum_ = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x_new[i] = (b[i] - sum_) / A[i][i]

        if np.linalg.norm(x_new - x, ord=np.inf) < tol:
            return x_new.tolist(), True 

        x = x_new.copy()

    return x.tolist(), False 

@app.route('/jacobi', methods=['POST'])
def solve_jacobi():
    data = request.get_json()
    
    if not data or 'A' not in data or 'b' not in data:
        return jsonify({"error": "Datos de entrada inválidos. Se requiere 'A' y 'b'."}), 400
    
    A = np.array(data["A"], dtype=float)
    b = np.array(data["b"], dtype=float)

    if not is_diagonally_dominant(A):
        A, b = rearrange_to_diagonal_dominance(A, b)

    solution, converged = jacobi_method(A, b)
    
    return jsonify({"solution": solution, "converged": converged})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
