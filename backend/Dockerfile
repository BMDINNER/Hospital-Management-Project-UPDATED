FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3500

CMD ["sh", "-c", "npm run seed && npm run seed-medicines && npm run start"]