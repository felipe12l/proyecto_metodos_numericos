from sympy import symbols, lambdify, sympify
from flask import Flask, request, jsonify

app = Flask(__name__)

class Secant:
    def __init__(self, function: str, x0, x1, var="x", iterations=100, tol=1e-5):
        self.var = symbols(var)
        self.expr = sympify(function)
        self.function = lambdify(self.var, self.expr)
        self.x0 = float(x0)
        self.x1 = float(x1)
        self.iterations = int(iterations)
        self.tol = float(tol)

    def safe_float(self, value):
        """Convierte de manera segura cualquier valor a float Python"""
        try:
            if hasattr(value, 'evalf'):  # Para objetos SymPy
                return float(value.evalf())
            return float(value)
        except (TypeError, ValueError, AttributeError):
            return float(str(value))

    def calculate_secant(self):
        points = []
        
        for j in range(self.iterations):
            try:
                f_x0 = self.function(self.x0)
                f_x1 = self.function(self.x1)
                
            except Exception as e:
                return {"error": f"Error evaluando la función: {str(e)}"}
            
            if abs(f_x1 - f_x0) < 1e-15:
                return {"error": "División por cero en el método de la secante"}
            
            x_new = self.x1 - f_x1 * (self.x1 - self.x0) / (f_x1 - f_x0)
            
            if abs(x_new - self.x1) < self.tol:
                try:
                    x_new_safe = self.safe_float(x_new)
                    y_new_safe = self.safe_float(self.function(x_new))
                    
                    i = x_new_safe - 3
                    while i <= x_new_safe + 3:
                        if abs(i - x_new_safe) < 1e-8:
                            points.append({
                                "x": x_new_safe, 
                                "y": y_new_safe, 
                                "special": True
                            })
                        else:
                            points.append({
                                "x": i,
                                "y": self.safe_float(self.function(i))
                            })
                        i += 0.1
                    
                    return {
                        "result": {
                            "root": x_new_safe,
                            "iteracion": j + 1,
                            "points": points
                        }
                    }
                except Exception as e:
                    return {"error": f"Error calculando resultado final: {str(e)}"}
            
            self.x0, self.x1 = self.x1, x_new
        
        return {"error": f"No se encontró la raíz después de {self.iterations} iteraciones"}

@app.route("/secante", methods=["POST"])
def secant_endpoint():
    try:
        data = request.get_json()
        
        function = data.get("function")
        x0 = data.get("x0")
        x1 = data.get("x1")
        iterations = data.get("iterations", 100)
        var = data.get("var", "x")
        tol = data.get("tol", 1e-5)
        
        if function is None or x0 is None or x1 is None:
            return jsonify({"error": "Parámetros incompletos"}), 400
    
        secant_solver = Secant(function, x0, x1, var, iterations, tol)
        result = secant_solver.calculate_secant()
        
        return jsonify(result)
        
    except Exception as e:
        error_msg = str(e)
        import traceback
        traceback.print_exc()
        return jsonify({"error": error_msg}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)