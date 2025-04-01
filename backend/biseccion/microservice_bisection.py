
from flask import Flask, request, jsonify
app = Flask(__name__)
@app.route('/bisection', methods=['POST'])
def bisection():
    try:
        data = request.get_json()
        function = data['function']
        point1 = data['point1']
        point2 = data['point2']
        iteration = data['iteration']

        # Call the bisection method from manager_bisection
        from backend.biseccion.manager_bisection import manager_bisection
        bisection_manager = manager_bisection(function, point1, point2, iteration)
        result = bisection_manager.bisection()

        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    


if __name__ == '__main__':
    app.run("0.0.0.0",port=5003)