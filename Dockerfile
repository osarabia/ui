FROM node:10.6.0-alpine


RUN mkdir /code
COPY . /code/
WORKDIR /code/spa_gastos_ui

EXPOSE 8080:8080

RUN npm install
