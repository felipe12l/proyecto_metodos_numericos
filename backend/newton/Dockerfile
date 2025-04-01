FROM python:slim
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install requirements.txt

CMD ["python", "manager_newton.py"]