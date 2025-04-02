# Use an official Python runtime as a parent image
FROM python:3.8

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY bisection.py .

# Install any needed packages specified in requirements.txt
RUN pip install flask numpy

# Run the application
CMD ["python", "bisection.py"]
