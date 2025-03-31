FROM python:3.8

WORKDIR /app

COPY gauss_seidel.py .

RUN pip install flask numpy

CMD ["python", "gauss_seidel.py"]