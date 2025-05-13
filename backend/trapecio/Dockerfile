
FROM python:3.11

WORKDIR /app

COPY . /app

RUN pip install flask sympy

EXPOSE 5000

CMD ["python", "trapecio.py"]
