FROM python:3.8

WORKDIR /app

COPY . /app

RUN pip install flask sympy

EXPOSE 3000

CMD ["python", "secante.py"]
