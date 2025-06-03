from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/simpson', methods=['POST'])
def simpson():
    data = request.get_json()

    # 1) Verificamos campos requeridos
    required_fields = ['funcion', 'limite_inferior', 'limite_superior', 'intervalos']
    if not data or any(field not in data for field in required_fields):
        return jsonify({
            "error": "Faltan parámetros. Se requieren 'funcion', 'limite_inferior', 'limite_superior' y 'intervalos'."
        }), 400

    funcion_str = data['funcion']

    # 2) Convertir y validar números
    try:
        a = float(data['limite_inferior'])
    except ValueError:
        return jsonify({"error": "El parámetro 'limite_inferior' debe ser un número."}), 400

    try:
        b = float(data['limite_superior'])
    except ValueError:
        return jsonify({"error": "El parámetro 'limite_superior' debe ser un número."}), 400

    try:
        n = int(data['intervalos'])
    except ValueError:
        return jsonify({"error": "El parámetro 'intervalos' debe ser un número entero."}), 400

    # 3) Validaciones específicas del método
    if a >= b:
        return jsonify({"error": "El límite inferior debe ser menor que el límite superior."}), 400

    if n <= 0:
        return jsonify({"error": "El número de intervalos debe ser mayor que 0."}), 400

    if n % 2 != 0:
        return jsonify({"error": "El número de intervalos debe ser par para el método de Simpson."}), 400

    # 4) Validar sintaxis de f(x) con x=1
    try:
        eval(funcion_str, {"x": 1, "X": 1, "np": np})
    except Exception:
        return jsonify({"error": "Error en la sintaxis de la función."}), 400

    # 5) Definir función evaluadora
    def evaluar_funcion(x):
        try:
            return eval(funcion_str, {"x": x, "X": x, "np": np})
        except Exception:
            raise ValueError(f"Error al evaluar la función en x = {x}")

    # 6) Verificar que la función se pueda evaluar en los extremos
    try:
        evaluar_funcion(a)
        evaluar_funcion(b)
    except Exception:
        return jsonify({"error": "La función no se puede evaluar en los límites de integración."}), 400

    # 7) Calcular h (ancho de cada subintervalo)
    h = (b - a) / n

    # 8) Aplicar el método de Simpson
    try:
        # Evaluar en x0 = a
        suma = evaluar_funcion(a)
        
        # Lista para almacenar los puntos y valores (para graficar)
        puntos_x = [a]
        puntos_y = [suma]
        
        # Evaluar en puntos intermedios
        for i in range(1, n):
            xi = a + i * h
            yi = evaluar_funcion(xi)
            puntos_x.append(xi)
            puntos_y.append(yi)
            
            # Simpson: coeficiente 4 para índices impares, 2 para pares
            if i % 2 == 1:  # índice impar
                suma += 4 * yi
            else:  # índice par
                suma += 2 * yi
        
        # Evaluar en xn = b
        yn = evaluar_funcion(b)
        suma += yn
        puntos_x.append(b)
        puntos_y.append(yn)
        
        # Multiplicar por h/3
        resultado = (h / 3) * suma

    except Exception as e:
        return jsonify({
            "error": f"Error durante el cálculo: {str(e)}"
        }), 400

    # 9) Preparar datos para graficar la función
    try:
        # Crear más puntos para una gráfica suave
        xs_plot = np.linspace(a, b, 500)
        ys_plot = [evaluar_funcion(x) for x in xs_plot]
        
        # Datos para la gráfica
        func_plot = [[float(x), float(y)] for x, y in zip(xs_plot, ys_plot)]
        
        # Puntos de Simpson (los nodos usados en el cálculo)
        simpson_points = [[float(x), float(y)] for x, y in zip(puntos_x, puntos_y)]
        
    except Exception:
        return jsonify({"error": "Error al generar datos para la gráfica."}), 400

    # 10) Preparar información adicional del método
    info_calculo = {
        "limite_inferior": float(a),
        "limite_superior": float(b),
        "numero_intervalos": n,
        "ancho_intervalo": float(h),
        "numero_puntos": n + 1
    }

    # 11) Construir la respuesta JSON
    response = {
        "resultado": float(resultado),
        "info_calculo": info_calculo,
        "puntos_simpson": simpson_points,
        "func_plot": func_plot
    }
    
    return jsonify(response), 200

@app.route('/simpson_error', methods=['POST'])
def simpson_error():
    """
    Endpoint adicional para calcular el error teórico del método de Simpson
    si se proporciona la cuarta derivada de la función
    """
    data = request.get_json()
    
    required_fields = ['cuarta_derivada', 'limite_inferior', 'limite_superior', 'intervalos']
    if not data or any(field not in data for field in required_fields):
        return jsonify({
            "error": "Para calcular el error se requieren 'cuarta_derivada', 'limite_inferior', 'limite_superior' y 'intervalos'."
        }), 400

    try:
        f4_str = data['cuarta_derivada']
        a = float(data['limite_inferior'])
        b = float(data['limite_superior'])
        n = int(data['intervalos'])
        
        # Validar sintaxis de la cuarta derivada
        eval(f4_str, {"x": 1, "X": 1, "np": np})
        
        # Calcular h
        h = (b - a) / n
        
        # Encontrar el máximo de la cuarta derivada en [a,b]
        xs_sample = np.linspace(a, b, 1000)
        max_f4 = max(abs(eval(f4_str, {"x": x, "X": x, "np": np})) for x in xs_sample)
        
        # Error teórico de Simpson: -(b-a)*h^4*M/(180) donde M es max|f^(4)|
        error_teorico = abs((b - a) * (h**4) * max_f4 / 180)
        
        return jsonify({
            "error_teorico": float(error_teorico),
            "max_cuarta_derivada": float(max_f4),
            "ancho_intervalo": float(h)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error al calcular el error teórico: {str(e)}"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)