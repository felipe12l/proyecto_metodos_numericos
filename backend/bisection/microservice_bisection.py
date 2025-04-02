import manager_bisection as mb

from flask import Flask, request, jsonify
app = Flask(__name__)


@app.route('/bisection', methods=['POST'])
def bisection():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        if 'function' not in data or 'point1' not in data or 'point2' not in data or 'iteration' not in data:
            return jsonify({'error': 'Missing parameters'}), 400
        function = data['function']
        point1 = data['point1']
        point2 = data['point2']
        iteration = data['iteration']

        # Call the bisection method from manager_bisection

        bisection_manager = mb.manager_bisection(
            function, point1, point2, iteration)
        result = bisection_manager.bisection()

        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run("0.0.0.0", port=5000)
