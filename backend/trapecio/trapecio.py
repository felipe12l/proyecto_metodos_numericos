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
        trapezoid_points = []

        for i in range(self.n):
            x0 = self.a + i * h
            x1 = x0 + h
            y0 = self.function(x0)
            y1 = self.function(x1)

            # Área (por si lo necesitas luego): area = (y0 + y1) * h / 2

            # Agregar 4 puntos: (x0, 0), (x0, y0), (x1, y1), (x1, 0)
            trapezoid_points.extend([
                {"x": x0, "y": 0},
                {"x": x0, "y": y0},
                {"x": x1, "y": y1},
                {"x": x1, "y": 0},
            ])

            if i != 0:  # Interiores (excepto extremos)
                result += self.function(x0)

        integral = result * h
        return {
            "integral": integral,
            "subintervals": self.n,
            "a": self.a,
            "b": self.b,
            "function": str(self.expr),
            "trapezoid_points": trapezoid_points
        }

@app.route("/trapecio", methods=["POST"])
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
    app.run(host="0.0.0.0", port=3000)
