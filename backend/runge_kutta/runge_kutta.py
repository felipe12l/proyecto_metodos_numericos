import sympy as sp
from flask import Flask, request, jsonify

app = Flask(__name__)


def runge_kutta(f, initial_x: float, initial_y: float, step: float, final_x: float) -> list:
    """
    Implementación de Runge–Kutta 4º orden.
    - f: callable que recibe (x, y) y retorna f(x, y).
    - initial_x, initial_y: condiciones iniciales.
    - step: tamaño de paso h.
    - final_x: valor de x hasta donde integrar.
    Devuelve lista de tuplas (x, y) en cada paso.
    """
    x = initial_x
    y = initial_y
    result = []
    while x < final_x:
        result.append((x, y))
        k1 = f(x, y)
        k2 = f(x + step/2, y + k1 * step/2)
        k3 = f(x + step/2, y + k2 * step/2)
        k4 = f(x + step,   y + k3 * step)
        y += (k1 + 2*k2 + 2*k3 + k4) * step / 6
        x += step
    return result


@app.route("/runge_kutta", methods=["POST"])
def runge_kutta_endpoint():
    # Obtener JSON de la petición POST :contentReference[oaicite:5]{index=5}
    data = request.get_json()
    equation_str = data.get("equation")
    initial_x = data.get("initial_x")
    initial_y = data.get("initial_y")
    step = data.get("step")
    final_value = data.get("final_value")

    # Validación de parámetros
    if None in (equation_str, initial_x, initial_y, step, final_value):
        return jsonify({"error": "Parámetros incompletos"}), 400

    try:
        # 1. Definir símbolos y parsear la ecuación
        # :contentReference[oaicite:6]{index=6}
        x, y = sp.symbols('x y')
        # :contentReference[oaicite:7]{index=7}
        expr = sp.sympify(equation_str)

        # 2. Crear callable numérico a partir de la expresión
        # :contentReference[oaicite:8]{index=8}
        func = sp.lambdify((x, y), expr, 'math')

        # 3. Ejecutar el método Runge–Kutta
        result = runge_kutta(
            func,
            float(initial_x),
            float(initial_y),
            float(step),
            float(final_value)
        )

        # 4. Devolver el resultado como JSON
        # :contentReference[oaicite:9]{index=9}
        return jsonify({"result": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    # Asegúrate de exponer el puerto que mapeas en Docker
    app.run(host="0.0.0.0", port=3000)
