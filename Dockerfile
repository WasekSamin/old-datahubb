FROM python:3.11
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY re.txt .
RUN pip install -r re.txt

COPY . .

EXPOSE 8001

RUN git config --global --add safe.directory /app
