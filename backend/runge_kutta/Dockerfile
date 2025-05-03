FROM python:3.8

WORKDIR /app

COPY runge_kutta.py .

RUN pip install flask numpy sympy

CMD ["python", "runge_kutta.py"]