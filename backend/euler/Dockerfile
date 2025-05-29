FROM python:3.8

WORKDIR /app

COPY euler.py .

RUN pip install flask numpy sympy

CMD [ "python", "euler.py" ]