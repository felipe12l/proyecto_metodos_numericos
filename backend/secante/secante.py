from sympy import symbols, lambdify, sympify
from flask import Flask, request, jsonify

app = Flask(__name__)

class Secant:
    def __init__(self, function: str, x0, x1, var = "x", iterations=100, tol =1e-5):
        self.var = symbols(var)
        self.expr = sympify(function)
        self.function = lambdify(self.var, self.expr)
        self.x0 = float(x0)
        self.x1 = float(x1)
        self.iterations = int(iterations)
        self.tol = tol

    def calculate_secant(self):
        for _ in range(self.iterations):
            f_x0 = self.function(self.x0)
            f_x1 = self.function(self.x1)

            if f_x1 == f_x0:
                return {"error": "División por cero en el método de la secante"}

            x_new = self.x1 - f_x1 * (self.x1 - self.x0) / (f_x1 - f_x0)

            if abs(x_new - self.x1) < self.tol:
                return {"root": x_new, "iteracion": _}
            
            self.x0, self.x1 = self.x1, x_new

        return {"error": "No se encontro la raiz"}

@app.route("/secant", methods=["POST"])
def secant_endpoint():
    data = request.get_json()

    function = data.get("function")
    x0 = data.get("x0")
    x1 = data.get("x1")
    iterations = data.get("iterations", 100)  
    var = data.get("var", "x")
    tol = data.get("tol", 1e-5)

    if function is None or x0 is None or x1 is None:
        return jsonify({"error": "Parámetros incompletos"}), 400

    try:
        secant_solver = Secant(function, float(x0), float(x1), var, int(iterations), tol)
        result = secant_solver.calculate_secant()
        return jsonify(result)
    except "error":
        return jsonify({"error": "Valores numéricos inválidos"}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
