FROM python:3.8

WORKDIR /app

COPY jacobi.py .

RUN pip install flask numpy

CMD [ "python", "jacobi.py" ]