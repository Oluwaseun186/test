
FROM node:18-slim

WORKDIR /app/todo/

COPY . /app/todo/

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]