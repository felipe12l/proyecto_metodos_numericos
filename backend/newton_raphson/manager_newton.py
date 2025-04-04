from sympy import symbols, diff, lambdify,sympify
from flask import Flask, request, jsonify

class newton:
    def __init__(self,function:str,point,iterations,var):
        self.var=symbols(f"{var}")
        self.expr = sympify(function)
        self.function=lambdify(self.var,function)
        self.point=point
        self.iterations=iterations
        
        
    def __derivate(self):
        der_expr = diff(self.expr, self.var)  
        return lambdify(self.var, der_expr)  

            
    def calculate_newton(self):
        der=self.__derivate()
        
        while True:
            if self.iterations==0:
                break
            self.point=self.point-self.function(self.point)/der(self.point)
            self.iterations-=1
        return self.point
    

app = Flask(__name__)
@app.route('/newton', methods=['POST'])
def newton_method():
    data = request.get_json()
    if not data or 'function' not in data or 'point' not in data or 'iterations' not in data or 'var' not in data:
        return {"error": "Invalid input. Required: 'function', 'point', 'iterations', and 'var'."}, 400

    function = data['function']
    point = data['point']
    iterations = data['iterations']
    var = data['var']

    newton_instance = newton(function, point, iterations, var)
    result = newton_instance.calculate_newton()

    return {"result": result}

if __name__ == '__main__':
    # El servidor escucha en todas las interfaces en el puerto 5000.
    app.run(host='0.0.0.0', port=5000)