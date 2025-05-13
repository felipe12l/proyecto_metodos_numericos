from sympy import symbols, lambdify, sympify
from flask import Flask, request, jsonify

app = Flask(__name__)

class Trapezoid:
    def __init__(self, function: str, a, b, n, var="x"):
        self.var = symbols(var)
        self.expr = sympify(function)
        self.function = lambdify(self.var, self.expr)
        self.a = float(a)
        self.b = float(b)
        self.n = int(n)

    def calculate_trapezoid(self):
        h = (self.b - self.a) / self.n
        result = 0.5 * (self.function(self.a) + self.function(self.b))

        for i in range(1, self.n):
            x_i = self.a + i * h
            result += self.function(x_i)

        integral = result * h
        return {"integral": integral, "subintervals": self.n}

@app.route("/trapezoid", methods=["POST"])
def trapezoid_endpoint():
    data = request.get_json()

    function = data.get("function")
    a = data.get("a")
    b = data.get("b")
    n = data.get("n")
    var = data.get("var", "x")

    if function is None or a is None or b is None or n is None:
        return jsonify({"error": "Parámetros incompletos"}), 400

    try:
        trap_solver = Trapezoid(function, float(a), float(b), int(n), var)
        result = trap_solver.calculate_trapezoid()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Valores inválidos: {str(e)}"}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
