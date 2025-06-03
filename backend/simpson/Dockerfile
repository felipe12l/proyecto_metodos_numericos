FROM python:3.8

WORKDIR /app

COPY simpson.py .

RUN pip install flask numpy

CMD ["python", "simpson.py"]