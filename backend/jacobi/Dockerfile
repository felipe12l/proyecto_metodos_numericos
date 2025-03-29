FROM python:3.11
WORKDIR /app
COPY . /app
RUN pip install flask numpy
EXPOSE 5000
CMD [ "python", "jacobi.py", "--reload" ]