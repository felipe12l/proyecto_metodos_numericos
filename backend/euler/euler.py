import sympy  as sp
from flask import Flask, request, jsonify
app = Flask(__name__)
def euler(f: str,x0:float,xf:float,y0:float,steps:int)-> list:
    """
        Calcula el metodo de euler 
    Args:
        f (_type_): Funcion
        x0 (float): valor inicial en x
        xf (float): Valor final en x
        y0 (float): Valor inicial en y
        steps (int): cantidad de pasos

    Returns:
        list: Resultados
    """
    x,y=sp.symbols("x,y")
    fun=sp.sympify(f)
    ev=sp.lambdify((x,y),fun)
    h=(xf-x0)/steps
    xi=x0
    yi=y0
    result=[[x0,y0]]
    
    while xi<xf:
        yi+=h*ev(xi,yi)
        xi+=h
        result.append([xi,yi])
    return result

@app.route("/euler", methods=["POST"])
def euler_endpoint():
    data= request.get_json()
    equation=data.get("equation")
    initial_x=data.get("initial_x")
    initial_y=data.get("initial_y")
    step=data.get("step")
    final_value=data.get("final_value")
    ## resolver
    if None in (equation, initial_x, initial_y, step, final_value):

        return jsonify({"error": f"Parámetros incompletos i{equation}, initial_x={initial_x}, initial_y={initial_y}, step={step}, final_value={final_value}"}), 400
    try:
        # 3. Ejecutar el método Euler
        result = euler(equation, float(initial_x), float(final_value), float(initial_y), int(step))
        return jsonify({"result": result})  # <--- aquí el cambio
    except Exception as e:
        return jsonify({"error": str(e)}), 400
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
