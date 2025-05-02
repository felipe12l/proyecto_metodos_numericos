FROM python:3.8

WORKDIR /app

COPY newton.py .

RUN pip install flask numpy sympy

CMD ["python", "rungekutta.py"]