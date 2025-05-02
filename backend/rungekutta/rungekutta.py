import sympy as sp
from flask import Flask, request, jsonify
app = Flask(__name__)

def rungekutta(ecuation:sp.Function,initialx:float,initialy:float,step:float,finalvalue:float)-> list:
    x=initialx
    y=initialy
    result= []
    while x < finalvalue:
        result.append((x,y))
        k1=ecuation(x,y)
        k2=ecuation(x+step/2,y+k1*step/2)
        k3=ecuation(x+step/2,y+k2*step/2)
        k4=ecuation(x+step,y+k3*step)
        x += step
        y += (k1 + 2*k2 + 2*k3 + k4) * step / 6
    return result
@app.route("/rungekutta", methods=["POST"])
def rungekutta_endpoint():
    data = request.get_json()
    equation_str = data.get("equation")
    initial_x = data.get("initial_x")
    initial_y = data.get("initial_y")
    step = data.get("step")
    final_value = data.get("final_value")

    if equation_str is None or initial_x is None or initial_y is None or step is None or final_value is None:
        return jsonify({"error": "Parámetros incompletos"}), 400

    try:
        x, y = sp.symbols('x y')
        equation = sp.sympify(equation_str)
        rungekutta_result = rungekutta(equation, float(initial_x), float(initial_y), float(step), float(final_value))
        return jsonify({"result": rungekutta_result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)